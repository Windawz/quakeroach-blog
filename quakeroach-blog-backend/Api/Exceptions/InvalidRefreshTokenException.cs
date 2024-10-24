namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class InvalidRefreshTokenException()
    : BadInputException("Provided refresh token is invalid");