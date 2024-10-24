namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class NonPositiveMaxCountException(int maxCount)
    : BadInputException($"Provided max count ({maxCount}) must be positive");