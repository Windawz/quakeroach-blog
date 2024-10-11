using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Repositories;

public interface IUserRepository : IRepositoryBase<User>
{
    Task<User?> GetByIdAsync(long id);

    Task<User?> GetByNameAsync(string name);
}