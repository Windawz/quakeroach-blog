using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Middleware;
using Quakeroach.Blog.Backend.Api.Services.Repositories;
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

        builder.Services.AddDbContext<MainDbContext>(o =>
        {
            o.UseSqlite(builder.Configuration.GetConnectionString("Default"));
        });

        builder.Services
            .AddScoped<IBlogPostRepository, BlogPostRepository>()
            .AddScoped<IBlogPostsService, BlogPostsService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.UseMiddleware<ValidationExceptionHandlerMiddleware>();
        app.MapControllers();

        app.Run();
    }
}
