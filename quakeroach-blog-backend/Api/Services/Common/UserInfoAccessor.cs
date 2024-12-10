using System.Security.Claims;
using Microsoft.Extensions.Options;
using Quakeroach.Blog.Backend.Api.Configuration;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IUserInfoAccessor
{
    string GetUserName(ClaimsPrincipal claimsPrincipal);
}

public class UserInfoAccessor : IUserInfoAccessor
{
    private readonly AuthOptions _authOptions;

    public UserInfoAccessor(IOptions<AuthOptions> authOptions)
    {
        _authOptions = authOptions.Value;
    }

    public string GetUserName(ClaimsPrincipal claimsPrincipal)
    {
        return claimsPrincipal.FindFirst(_authOptions.NameClaimType)?.Value
            ?? throw new InvalidOperationException("User has no name claim");
    }
}