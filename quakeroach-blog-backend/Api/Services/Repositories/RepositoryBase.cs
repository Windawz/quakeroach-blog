using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.Repositories;

public abstract class RepositoryBase<TEntity> where TEntity : Entity
{
    protected RepositoryBase(MainDbContext dbContext)
    {
        DbContext = dbContext;
    }

    protected MainDbContext DbContext { get; }

    public async Task<long> AddAsync(TEntity entity)
    {
        entity = entity with { Id = default };
        var entry = await DbContext.Set<TEntity>().AddAsync(entity);
        await DbContext.SaveChangesAsync();
        return entry.Entity.Id;
    }

    public async Task RemoveAsync(long id)
    {
        await DbContext.Set<TEntity>()
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync();
    }
}