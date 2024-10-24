using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Quakeroach.Blog.Backend.Api.Configuration;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Middleware;
using Quakeroach.Blog.Backend.Api.Services.Common;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddCors(o =>
        {
            string? frontendUrl = builder.Configuration
                .GetSection("Frontend:Url")
                .Get<string>();
            
            if (frontendUrl is not null)
            {
                o.AddPolicy("AllowFrontend", x =>
                {
                    x.WithOrigins(frontendUrl);
                });
            }
        });

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(o =>
            {
                var authOptions = builder.Configuration.GetRequiredSection("JwtBearerAuth")
                    .Get<JwtBearerAuthOptions>()
                        ?? throw new InvalidOperationException($"Failed to bind {nameof(JwtBearerAuthOptions)}");

                var parameters = o.TokenValidationParameters;

                parameters.ValidateIssuer = true;
                parameters.ValidIssuer = authOptions.Issuer;
                parameters.ValidateAudience = true;
                parameters.ValidAudience = authOptions.Audience;
                parameters.ValidateLifetime = true;
                parameters.IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(authOptions.IssuerSigningKey));
            });

        builder.Services.AddTransient<BusinessExceptionHandlerMiddleware>();

        builder.Services.AddDbContext<MainDbContext>(o =>
        {
            o.UseSqlite(builder.Configuration.GetConnectionString("Default"));
        });

        builder.Services
            .AddScoped<IPasswordHasher<User>, PasswordHasher<User>>()
            .AddScoped<ITokenFormatter, TokenFormatter>()
            .AddScoped<ITokenGenerator, TokenGenerator>()
            .AddScoped<IBlogPostsService, BlogPostsService>()
            .AddScoped<ILoginService, LoginService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowFrontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<BusinessExceptionHandlerMiddleware>();
        app.MapControllers();

        app.Run();
    }
}
