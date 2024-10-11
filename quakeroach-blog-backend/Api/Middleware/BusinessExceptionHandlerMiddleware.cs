using Quakeroach.Blog.Backend.Api.Exceptions;

namespace Quakeroach.Blog.Backend.Api.Middleware;

public class BusinessExceptionHandlerMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (BusinessException e)
        {
            int? statusCode = e switch
            {
                BadInputException => StatusCodes.Status400BadRequest,
                NotFoundException => StatusCodes.Status404NotFound,
                _ => null,
            };

            if (statusCode is null)
            {
                throw;
            }

            context.Response.StatusCode = statusCode.Value;

            await context.Response.WriteAsJsonAsync(new
            {
                ErrorMessage = e.Message
            });
        }
    }
}