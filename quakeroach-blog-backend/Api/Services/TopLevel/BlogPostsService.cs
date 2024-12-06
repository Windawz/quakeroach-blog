using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Exceptions;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IBlogPostsService
{
    Task<List<BlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime? minPublishDate = null);
    
    Task<BlogPostOutput> GetAsync(long id);

    Task<BlogPostOutput> CreateAsync(string authorName, BlogPostCreationInput input);

    Task<BlogPostDeletionResult> DeleteAsync(string userName, long id);
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

public enum BlogPostDeletionResult
{
    Success = 1,
    NotFound,
    NoPermission,
}

public class BlogPostsService : IBlogPostsService
{
    private readonly MainDbContext _dbContext;

    public BlogPostsService(MainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<BlogPostOutput>> GetManyAsync(
        int maxCount,
        DateTime? minPublishDate = null)
    {
        if (maxCount <= 0)
        {
            throw new NonPositiveMaxCountException(maxCount);
        }

        IQueryable<BlogPost> blogPosts = _dbContext.BlogPosts
            .Include(x => x.AuthorUser)
            .OrderByDescending(x => x.PublishDate);
        
        if (minPublishDate is not null)
        {
            blogPosts = blogPosts.Where(x => x.PublishDate >= minPublishDate);
        }

        return (await blogPosts
            .Take(maxCount)
            .Select(x => new
            {
                x.Id,
                x.Title,
                AuthorName = x.AuthorUser.Name,
                x.PublishDate,
                x.Content,
            })
            .ToListAsync())
            .Select(x => new BlogPostOutput(
                Id: x.Id,
                Title: x.Title,
                AuthorName: x.AuthorName,
                PublishDate: x.PublishDate,
                Content: x.Content))
            .ToList();
    }

    public async Task<BlogPostOutput> GetAsync(long id)
    {
        var blogPost = await _dbContext.BlogPosts
            .Include(x => x.AuthorUser)
            .SingleOrDefaultAsync(x => x.Id == id)
                ?? throw new BlogPostNotFoundException(id);
        
        return new BlogPostOutput(
            Id: blogPost.Id,
            Title: blogPost.Title,
            AuthorName: blogPost.AuthorUser.Name,
            PublishDate: blogPost.PublishDate,
            Content: blogPost.Content);
    }

    public async Task<BlogPostOutput> CreateAsync(string authorName, BlogPostCreationInput input)
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

        return new BlogPostOutput(
            Id: blogPost.Id,
            Title: blogPost.Title,
            AuthorName: blogPost.AuthorUser.Name,
            PublishDate: blogPost.PublishDate,
            Content: blogPost.Content);
    }

    public async Task<BlogPostDeletionResult> DeleteAsync(string userName, long id)
    {
        var blogPost = await _dbContext.BlogPosts
            .Include(x => x.AuthorUser)
            .SingleOrDefaultAsync(x => x.Id == id);
        
        if (blogPost is null)
        {
            return BlogPostDeletionResult.NotFound;
        }

        if (blogPost.AuthorUser.Name != userName)
        {
            return BlogPostDeletionResult.NoPermission;
        }

        _dbContext.BlogPosts.Remove(blogPost);

        await _dbContext.SaveChangesAsync();

        return BlogPostDeletionResult.Success;
    }
}