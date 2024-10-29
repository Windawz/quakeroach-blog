namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class UserDoesNotExistException(string userName)
    : BadInputException($"User with name \"{userName}\" does not exist");