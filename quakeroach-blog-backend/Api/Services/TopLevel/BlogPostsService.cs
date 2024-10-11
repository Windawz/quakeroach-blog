using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Exceptions;
using Quakeroach.Blog.Backend.Api.Services.Repositories;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IBlogPostsService
{
    Task<List<BlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime minPublishDate);
    
    Task<BlogPostOutput> GetAsync(long id);

    Task<long> CreateAsync(BlogPostCreationInput input);
}

public record BlogPostOutput(
    string Title,
    DateTime PublishDate,
    string Content);

public record BlogPostCreationInput(
    string Title,
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

        var blogPosts = await _blogPostRepository.GetManyAsync(
            maxCount: maxCount,
            minPublishDate: minPublishDate);
        
        return blogPosts
            .Select(x => new BlogPostOutput(
                Title: x.Title,
                PublishDate: x.PublishDate,
                Content: x.Content))
            .ToList();
    }

    public async Task<BlogPostOutput> GetAsync(long id)
    {
        var blogPost = await _blogPostRepository.FindAsync(id)
            ?? throw new BlogPostIdNotFoundException(id);
        
        return new BlogPostOutput(
            Title: blogPost.Title,
            PublishDate: blogPost.PublishDate,
            Content: blogPost.Content);
    }

    public async Task<long> CreateAsync(BlogPostCreationInput input)
    {
        var publishDate = DateTime.UtcNow;

        var blogPost = new BlogPost(
            Title: input.Title,
            PublishDate: publishDate,
            Content: input.Content);
        
        long id = await _blogPostRepository.AddAsync(blogPost);

        return id;
    }

    public class NonPositiveMaxCountException(int maxCount)
        : BadInputException($"Provided max count ({maxCount}) must be positive");
    
    public class BlogPostIdNotFoundException(long id)
        : NotFoundException($"Blog post with provided id ({id}) does not exist");
}