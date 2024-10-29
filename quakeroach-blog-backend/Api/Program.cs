using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        builder.Services.AddOptions();

        builder.Services.AddCors();

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

        builder.Services
            .ConfigureOptions<ConfigureAuthOptions>()
            .ConfigureOptions<ConfigureFrontendOptions>()
            .ConfigureOptions<PostConfigureJwtBearerOptions>()
            .ConfigureOptions<PostConfigureCorsOptions>();

        builder.Services.AddTransient<BusinessExceptionHandlerMiddleware>();

        builder.Services.AddDbContext<MainDbContext>(o =>
        {
            o.UseSqlite(builder.Configuration.GetConnectionString("Default"));
        });

        builder.Services
            .AddHttpContextAccessor()
            .AddScoped<IPasswordHasher<User>, PasswordHasher<User>>()
            .AddScoped<IAccessTokenOperator, AccessTokenOperator>()
            .AddScoped<IRefreshTokenOperator, RefreshTokenOperator>()
            .AddScoped<IHttpContextView, HttpContextView>()
            .AddScoped<IBlogPostsService, BlogPostsService>()
            .AddScoped<IAuthService, AuthService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors(CorsConstants.DefaultPolicy);
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<BusinessExceptionHandlerMiddleware>();
        app.MapControllers();

        app.Run();
    }
}
