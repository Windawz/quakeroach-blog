using Microsoft.Extensions.Options;
using Quakeroach.Blog.Backend.Api.Configuration;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IHttpContextView
{
    string UserName { get; }
}

public class HttpContextView : IHttpContextView
{
    private readonly AuthOptions _authOptions;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpContextView(
        IOptions<AuthOptions> authOptions,
        IHttpContextAccessor httpContextAccessor)
    {
        _authOptions = authOptions.Value;
        _httpContextAccessor = httpContextAccessor;
    }

    public string UserName
    {
        get
        {
            var httpContext = _httpContextAccessor.HttpContext
                ?? throw new InvalidOperationException("Couldn't access HttpContext");

            var nameClaim = httpContext.User.FindFirst(_authOptions.NameClaimType)
                ?? throw new InvalidOperationException("User has no name claim");
            
            return nameClaim.Value;
        }
    }
}