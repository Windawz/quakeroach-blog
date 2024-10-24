namespace Quakeroach.Blog.Backend.Api.Exceptions;

public class BlogPostNotFoundException(long id)
    : NotFoundException($"Blog post with provided id ({id}) does not exist");