using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IRefreshTokenOperator
{
    Task<RefreshToken> CreateAsync(User user);

    Task<RefreshToken?> BindAsync(string rawToken);

    string Format(RefreshToken token);

    Task DestroyAsync(RefreshToken token);
}