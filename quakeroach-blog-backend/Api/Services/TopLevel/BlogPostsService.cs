using Quakeroach.Blog.Backend.Api.Services.Repositories;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IBlogPostsService
{
    Task<List<BlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime minPublishDate,
        string? authorName = null);
}

public class NonPositiveMaxCountException(int maxCount)
    : ValidationException($"Provided max count ({maxCount}) must be positive");

public record BlogPostOutput(
    string AuthorName,
    string Title,
    DateTime PublishDate,
    string Content);

public class BlogPostsService : IBlogPostsService
{
    private readonly IBlogPostRepository _blogPostRepository;

    public BlogPostsService(IBlogPostRepository blogPostRepository)
    {
        _blogPostRepository = blogPostRepository;
    }

    public async Task<List<BlogPostOutput>> GetManyAsync(
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
            .Select(x => new BlogPostOutput(
                AuthorName: x.Author.Name,
                Title: x.Title,
                PublishDate: x.PublishDate,
                Content: x.Content))
            .ToList();
    }
}