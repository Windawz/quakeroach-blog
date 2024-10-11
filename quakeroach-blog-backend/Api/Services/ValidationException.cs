namespace Quakeroach.Blog.Backend.Api.Services;

public class ValidationException : Exception
{
    public ValidationException(string message) : base(message) { }
}