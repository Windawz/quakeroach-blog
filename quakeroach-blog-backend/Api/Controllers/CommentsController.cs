using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quakeroach.Blog.Backend.Api.Services.Common;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;

namespace Quakeroach.Blog.Backend.Api.Controllers;

[Route("api")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ICommentsService _commentsService;
    private readonly IUserInfoAccessor _userInfoAccessor;

    public CommentsController(
        ICommentsService commentsService,
        IUserInfoAccessor userInfoAccessor)
    {
        _commentsService = commentsService;
        _userInfoAccessor = userInfoAccessor;
    }

    [HttpGet("comments/{id}")]
    public async Task<ActionResult<CommentOutput>> Get(long id)
    {
        return await _commentsService.GetAsync(id) switch
        {
            null => NotFound(),
            var output => output,
        };
    }


    [HttpGet("blogPosts/{blogPostId}/comments")]
    public async Task<List<CommentOutput>> GetMany(
        long blogPostId,
        int maxCount,
        DateTime? minPublishDate)
    {
        return await _commentsService.GetManyAsync(blogPostId, maxCount, minPublishDate);
    }
    
    [HttpPost("blogPosts/{blogPostId}/comments")]
    public async Task<ActionResult<CommentOutput>> Create(long blogPostId, CommentCreationInput input)
    {
        return await _commentsService.CreateAsync(
            _userInfoAccessor.TryGetUserName(User),
            blogPostId,
            input) switch
        {
            CommentCreationSuccessResult { CommentOutput: var output } => CreatedAtAction(
                nameof(Get),
                new { blogPostId, id = output.Id },
                value: output),
            CommentCreationErrorResult { Kind: var kind } => kind switch
            {
                CommentCreationErrorKind.AnonymousNameConflict => Conflict(),
                CommentCreationErrorKind.BlogPostNotFound => NotFound(),
                CommentCreationErrorKind.NoAuthorNameProvided => BadRequest(),
                _ => throw new InvalidOperationException($"Unknown {nameof(CommentCreationErrorKind)} value"),
            },
            _ => throw new InvalidOperationException($"Unknown {nameof(CommentCreationResult)} value"),
        };
    }

    [Authorize]
    [HttpDelete("comments/{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        var userName = _userInfoAccessor.GetUserName(User);

        return await _commentsService.DeleteAsync(userName, id) switch
        {
            CommentDeletionResult.Success => Ok(),
            CommentDeletionResult.NotFound => NotFound(),
            CommentDeletionResult.NoPermission => Forbid(),
            _ => throw new InvalidOperationException($"Unknown {nameof(CommentDeletionResult)} value"),
        };
    }
}