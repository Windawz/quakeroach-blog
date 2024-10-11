
using Quakeroach.Blog.Backend.Api.Services;

namespace Quakeroach.Blog.Backend.Api.Middleware;

public class ValidationExceptionHandlerMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException e)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new
            {
                ErrorMessage = e.Message
            });
        }
    }
}