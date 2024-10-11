namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class BadInputException(string message) : BusinessException(message);