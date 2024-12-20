using System.Security.Claims;
using Microsoft.Extensions.Options;
using Quakeroach.Blog.Backend.Api.Configuration;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IUserInfoAccessor
{
    string? TryGetUserName(ClaimsPrincipal claimsPrincipal);
}

public class UserInfoAccessor : IUserInfoAccessor
{
    private readonly AuthOptions _authOptions;

    public UserInfoAccessor(IOptions<AuthOptions> authOptions)
    {
        _authOptions = authOptions.Value;
    }

    public string? TryGetUserName(ClaimsPrincipal claimsPrincipal)
    {
        return claimsPrincipal.FindFirst(_authOptions.NameClaimType)?.Value;
    }
}

public static class UserInfoAccessorExtensions
{
    public static string GetUserName(this IUserInfoAccessor userInfoAccessor, ClaimsPrincipal claimsPrincipal)
    {
        return userInfoAccessor.TryGetUserName(claimsPrincipal)
            ?? throw new ArgumentException($"{nameof(claimsPrincipal)} has no user name", nameof(claimsPrincipal));
    }
}