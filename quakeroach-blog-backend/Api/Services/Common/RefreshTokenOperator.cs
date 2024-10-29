using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Quakeroach.Blog.Backend.Api.Configuration;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IRefreshTokenOperator
{
    Task<RefreshToken> CreateAsync(User user);

    Task<RefreshToken?> BindAsync(string rawToken);

    string Format(RefreshToken token);

    Task DestroyAsync(RefreshToken token);
}

public class RefreshTokenOperator : IRefreshTokenOperator
{
    private readonly AuthOptions _authOptions;
    private readonly MainDbContext _dbContext;

    public RefreshTokenOperator(
        IOptions<AuthOptions> authOptions,
        MainDbContext dbContext)
    {
        _authOptions = authOptions.Value;
        _dbContext = dbContext;
    }

    public async Task<RefreshToken> CreateAsync(User user)
    {
        var now = DateTime.UtcNow;

        var token = new RefreshToken
        {
            Name = Guid.NewGuid().ToString(),
            User = user,
            CreationTime = now,
        };

        _dbContext.RefreshTokens.Add(token);

        await _dbContext.SaveChangesAsync();

        return token;
    }

    public async Task<RefreshToken?> BindAsync(string rawToken)
    {
        if (!Guid.TryParse(rawToken, out _))
        {
            return null;
        }

        var tokenName = rawToken;

        var token = await _dbContext.RefreshTokens.Where(x => x.Name == tokenName)
            .SingleOrDefaultAsync();
        
        if (token is null)
        {
            return null;
        }

        return token;
    }

    public string Format(RefreshToken token)
    {
        return token.Name;
    }

    public async Task DestroyAsync(RefreshToken token)
    {
        _dbContext.RefreshTokens.Remove(token);

        await _dbContext.SaveChangesAsync();
    }
}