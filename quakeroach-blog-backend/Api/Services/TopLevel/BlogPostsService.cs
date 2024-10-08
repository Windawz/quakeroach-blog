using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IBlogPostsService
{
    Task<List<ShortBlogPostOutput>> GetManyAsync();
}

public record ShortBlogPostOutput(string AuthorName, string Content);
