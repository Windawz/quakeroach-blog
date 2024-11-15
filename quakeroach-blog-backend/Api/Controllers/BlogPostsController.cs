using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quakeroach.Blog.Backend.Api.Services.Common;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;

namespace Quakeroach.Blog.Backend.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BlogPostsController : ControllerBase
{
    private readonly IBlogPostsService _blogPostsService;
    private readonly IHttpContextView _httpContextView;

    public BlogPostsController(
        IBlogPostsService blogPostsService,
        IHttpContextView httpContextView)
    {
        _blogPostsService = blogPostsService;
        _httpContextView = httpContextView;
    }

    [HttpGet]
    public async Task<List<BlogPostOutput>> GetMany(
        [FromQuery] int maxCount,
        [FromQuery] DateTime minPublishDate)
    {
        return await _blogPostsService.GetManyAsync(
            maxCount: maxCount,
            minPublishDate: minPublishDate);
    }

    [HttpGet("{id}")]
    public async Task<BlogPostOutput> Get([FromRoute] long id)
    {
        return await _blogPostsService.GetAsync(id);
    }

    [HttpPost]
    [Authorize]
    public async Task<CreatedAtActionResult> Create([FromBody] BlogPostCreationInput input)
    {
        string authorName = _httpContextView.UserName;

        var result = await _blogPostsService.CreateAsync(authorName, input);

        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }
}
