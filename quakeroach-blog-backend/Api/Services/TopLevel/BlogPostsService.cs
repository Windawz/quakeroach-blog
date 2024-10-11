using Quakeroach.Blog.Backend.Api.Services.Repositories;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IBlogPostsService
{
    Task<List<BlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime minPublishDate);
}

public class NonPositiveMaxCountException(int maxCount)
    : ValidationException($"Provided max count ({maxCount}) must be positive");

public record BlogPostOutput(
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
        DateTime minPublishDate)
    {
        if (maxCount <= 0)
        {
            throw new NonPositiveMaxCountException(maxCount);
        }

        var blogPosts = await _blogPostRepository.GetAsync(
            maxCount: maxCount,
            minPublishDate: minPublishDate);
        
        return blogPosts
            .Select(x => new BlogPostOutput(
                Title: x.Title,
                PublishDate: x.PublishDate,
                Content: x.Content))
            .ToList();
    }
}