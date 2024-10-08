using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.Repositories;

public interface IBlogPostRepository
{
    Task<List<BlogPost>> GetAsync(
        int count,
        long? authorId = null,
        DateTime? minPublishDate = null,
        DateTime? maxPublishDate = null);

    Task<long> AddAsync(BlogPost blogPost);

    Task RemoveAsync(long blogPostId);
}

public class BlogPostRepository : RepositoryBase<BlogPost>, IBlogPostRepository
{
    public BlogPostRepository(MainDbContext dbContext) : base(dbContext) { }

    public async Task<List<BlogPost>> GetAsync(
        int count,
        long? authorId = null,
        DateTime? minPublishDate = null,
        DateTime? maxPublishDate = null)
    {
        IQueryable<BlogPost> query = DbContext.BlogPosts;

        if (authorId is not null)
        {
            query = query.Where(x => x.Author.Id == authorId.Value);
        }

        if (minPublishDate is not null)
        {
            query = query.Where(x => x.PublishDate >= minPublishDate.Value);
        }

        if (maxPublishDate is not null)
        {
            query = query.Where(x => x.PublishDate <= maxPublishDate.Value);
        }

        query = query.OrderByDescending(x => x.PublishDate)
            .Take(count);
        
        return await query.ToListAsync();
    }
}