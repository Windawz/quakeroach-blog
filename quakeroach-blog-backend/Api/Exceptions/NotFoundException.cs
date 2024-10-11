namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class NotFoundException(string message) : BusinessException(message);