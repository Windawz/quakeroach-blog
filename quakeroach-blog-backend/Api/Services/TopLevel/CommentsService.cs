using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Exceptions;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface ICommentsService
{
    Task<CommentOutput?> GetAsync(long id);

    Task<List<CommentOutput>> GetManyAsync(
        long blogPostId,
        int maxCount,
        DateTime? minPublishDate);
    
    Task<CommentCreationResult> CreateAsync(string? userName, long blogPostId, CommentCreationInput input);

    Task<CommentDeletionResult> DeleteAsync(string userName, long id);
}

public record CommentOutput(
    long Id,
    long BlogPostId,
    string AuthorName,
    DateTime PublishDate,
    string Contents);

public record CommentCreationInput(
    string? AuthorName,
    string Contents);

public abstract record CommentCreationResult;

public record CommentCreationSuccessResult(
    CommentOutput CommentOutput) : CommentCreationResult;

public record CommentCreationErrorResult(
    CommentCreationErrorKind Kind) : CommentCreationResult;

public enum CommentCreationErrorKind
{
    NoAuthorNameProvided = 1,
    AnonymousNameConflict,
    BlogPostNotFound,
}

public enum CommentDeletionResult
{
    Success = 1,
    NotFound,
    NoPermission,
}

public class CommentsService : ICommentsService
{
    private readonly MainDbContext _dbContext;

    public CommentsService(MainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommentCreationResult> CreateAsync(string? userName, long blogPostId, CommentCreationInput input)
    {
        bool isAuthenticated = userName is not null;

        string? actualAuthorName = isAuthenticated
            ? userName
            : input.AuthorName;
        
        if (string.IsNullOrWhiteSpace(actualAuthorName))
        {
            return new CommentCreationErrorResult(CommentCreationErrorKind.NoAuthorNameProvided);
        }

        var matchingUser = await _dbContext.Users
            .Where(x => x.Name == actualAuthorName)
            .SingleOrDefaultAsync();
        
        if (isAuthenticated)
        {
            Debug.Assert(matchingUser is not null, "No matching user found while authenticated");
        }

        if (!isAuthenticated && matchingUser is not null)
        {
            return new CommentCreationErrorResult(CommentCreationErrorKind.AnonymousNameConflict);
        }

        var blogPost = await _dbContext.BlogPosts.FindAsync(blogPostId);

        if (blogPost is null)
        {
            return new CommentCreationErrorResult(CommentCreationErrorKind.BlogPostNotFound);
        }

        var now = DateTime.UtcNow;

        Comment comment = isAuthenticated
            ? new AuthenticatedComment
            {
                Author = matchingUser!,
                BlogPost = blogPost,
                Contents = input.Contents,
                PublishDate = now,
            }
            : new AnonymousComment
            {
                AuthorName = input.AuthorName!,
                BlogPost = blogPost,
                Contents = input.Contents,
                PublishDate = now,
            };
        
        _dbContext.Comments.Add(comment);

        await _dbContext.SaveChangesAsync();

        return new CommentCreationSuccessResult(
            new CommentOutput(
                Id: comment.Id,
                BlogPostId: comment.BlogPost.Id,
                AuthorName: comment.GetAuthorName(),
                PublishDate: comment.PublishDate,
                Contents: comment.Contents));
    }

    public async Task<CommentDeletionResult> DeleteAsync(string userName, long id)
    {
        var comment = await _dbContext.AuthenticatedComments
            .Include(x => x.Author)
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync();
        
        if (comment is null)
        {
            return CommentDeletionResult.NotFound;
        }

        if (comment.Author.Name != userName)
        {
            return CommentDeletionResult.NoPermission;
        }

        _dbContext.AuthenticatedComments.Remove(comment);

        await _dbContext.SaveChangesAsync();

        return CommentDeletionResult.Success;
    }

    public async Task<CommentOutput?> GetAsync(long id)
    {
        var comment = await _dbContext.Comments
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync();
        
        if (comment is null)
        {
            return null;
        }

        return new CommentOutput(
            Id: comment.Id,
            BlogPostId: comment.BlogPost.Id,
            AuthorName: comment.GetAuthorName(),
            PublishDate: comment.PublishDate,
            Contents: comment.Contents);
    }

    public async Task<List<CommentOutput>> GetManyAsync(long blogPostId, int maxCount, DateTime? minPublishDate)
    {
        var comments = _dbContext.Comments
            .Where(x => x.BlogPost.Id == blogPostId);

        if (minPublishDate is not null)
        {
            comments = comments.Where(x => x.PublishDate >= minPublishDate);
        }
        
        comments = comments
            .OrderByDescending(x => x.PublishDate)
            .Take(maxCount);
        
        return (await comments
            .ToListAsync())
            .Select(x => new CommentOutput(
                Id: x.Id,
                BlogPostId: x.BlogPost.Id,
                AuthorName: x.GetAuthorName(),
                PublishDate: x.PublishDate,
                Contents: x.Contents))
            .ToList();
    }
}