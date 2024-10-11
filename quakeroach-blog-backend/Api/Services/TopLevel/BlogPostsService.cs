using Quakeroach.Blog.Backend.Api.Services.Logic;
using Quakeroach.Blog.Backend.Api.Services.Repositories;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IBlogPostsService
{
    Task<List<ShortBlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime minPublishDate,
        string? authorName = null);
}

public class NonPositiveMaxCountException(int maxCount)
    : ValidationException($"Provided max count ({maxCount}) must be positive");

public record ShortBlogPostOutput(
    string AuthorName,
    string Title,
    DateTime PublishDate,
    string Content);

public class BlogPostsService : IBlogPostsService
{
    private readonly IBlogPostRepository _blogPostRepository;
    private readonly IContentFormatter _contentFormatter;

    public BlogPostsService(
        IBlogPostRepository blogPostRepository,
        IContentFormatter contentFormatter)
    {
        _blogPostRepository = blogPostRepository;
        _contentFormatter = contentFormatter;
    }

    public async Task<List<ShortBlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime minPublishDate,
        string? authorName = null)
    {
        if (maxCount <= 0)
        {
            throw new NonPositiveMaxCountException(maxCount);
        }

        var blogPosts = await _blogPostRepository.GetAsync(
            maxCount: maxCount,
            authorName: authorName,
            minPublishDate: minPublishDate);
        
        return blogPosts
            .Select(x => new ShortBlogPostOutput(
                AuthorName: x.Author.Name,
                Title: x.Title,
                PublishDate: x.PublishDate,
                Content: _contentFormatter.FormatShort(x.Content)))
            .ToList();
    }
}