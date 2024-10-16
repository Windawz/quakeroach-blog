using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.Repositories;

public interface IBlogPostRepository : IRepositoryBase<BlogPost>
{
    Task<BlogPost?> FindAsync(long id);

    Task<List<BlogPost>> GetManyAsync(
        int maxCount,
        DateTime? minPublishDate = null,
        DateTime? maxPublishDate = null);
}

public class BlogPostRepository : RepositoryBase<BlogPost>, IBlogPostRepository
{
    public BlogPostRepository(MainDbContext dbContext) : base(dbContext) { }

    public async Task<BlogPost?> FindAsync(long id)
    {
        return await DbContext.BlogPosts.FindAsync(id);
    }

    public async Task<List<BlogPost>> GetManyAsync(
        int maxCount,
        DateTime? minPublishDate = null,
        DateTime? maxPublishDate = null)
    {
        IQueryable<BlogPost> query = DbContext.BlogPosts;

        if (minPublishDate is not null)
        {
            query = query.Where(x => x.PublishDate >= minPublishDate.Value);
        }

        if (maxPublishDate is not null)
        {
            query = query.Where(x => x.PublishDate <= maxPublishDate.Value);
        }

        query = query.OrderByDescending(x => x.PublishDate)
            .Take(maxCount);
        
        return await query.ToListAsync();
    }
}