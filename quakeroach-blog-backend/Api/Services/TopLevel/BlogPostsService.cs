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

    Task<long> CreateAsync(string authorName, BlogPostCreationInput input);
}

public record BlogPostOutput(
    long Id,
    string Title,
    string AuthorName,
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
                AuthorName: x.AuthorUser.Name,
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
            AuthorName: blogPost.AuthorUser.Name,
            PublishDate: blogPost.PublishDate,
            Content: blogPost.Content);
    }

    public async Task<long> CreateAsync(string authorName, BlogPostCreationInput input)
    {
        var publishDate = DateTime.UtcNow;
        var authorUser = await _dbContext.Users
            .Where(x => x.Name == authorName)
            .SingleOrDefaultAsync()
                ?? throw new UserDoesNotExistException(authorName);

        var blogPost = new BlogPost
        {
            Title = input.Title,
            AuthorUser = authorUser,
            PublishDate = publishDate,
            Content = input.Content,
        };

        _dbContext.BlogPosts.Add(blogPost);

        await _dbContext.SaveChangesAsync();

        return blogPost.Id;
    }
}