using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Exceptions;
using Quakeroach.Blog.Backend.Api.Storage;

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
    long Id,
    string Title,
    DateTime PublishDate,
    string Content);

public record BlogPostCreationInput(
    string Title,
    string Content);

public class BlogPostsService : IBlogPostsService
{
    private readonly MainDbContext _dbContext;

    public BlogPostsService(MainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<BlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime minPublishDate)
    {
        if (maxCount <= 0)
        {
            throw new NonPositiveMaxCountException(maxCount);
        }

        var blogPosts = await _dbContext.BlogPosts
            .OrderByDescending(x => x.PublishDate)
            .Where(x => x.PublishDate >= minPublishDate)
            .Take(maxCount)
            .ToListAsync();

        return blogPosts
            .Select(x => new BlogPostOutput(
                Id: x.Id,
                Title: x.Title,
                PublishDate: x.PublishDate,
                Content: x.Content))
            .ToList();
    }

    public async Task<BlogPostOutput> GetAsync(long id)
    {
        var blogPost = await _dbContext.BlogPosts.FindAsync(id)
            ?? throw new BlogPostNotFoundException(id);
        
        return new BlogPostOutput(
            Id: blogPost.Id,
            Title: blogPost.Title,
            PublishDate: blogPost.PublishDate,
            Content: blogPost.Content);
    }

    public async Task<long> CreateAsync(BlogPostCreationInput input)
    {
        var publishDate = DateTime.UtcNow;

        var blogPost = new BlogPost
        {
            Title = input.Title,
            PublishDate = publishDate,
            Content = input.Content,
        };

        _dbContext.BlogPosts.Add(blogPost);

        await _dbContext.SaveChangesAsync();

        return blogPost.Id;
    }
}