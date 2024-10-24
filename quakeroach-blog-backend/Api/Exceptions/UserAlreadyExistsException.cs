namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class UserAlreadyExistsException(string userName)
    : BusinessException($"User with name \"{userName}\" already exists");