using Microsoft.AspNetCore.Mvc;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;

namespace Quakeroach.Blog.Backend.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {
        private readonly IBlogPostsService _blogPostsService;

        public BlogPostsController(IBlogPostsService blogPostsService)
        {
            _blogPostsService = blogPostsService;
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
    }
}
