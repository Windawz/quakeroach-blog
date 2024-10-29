using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Options;

namespace Quakeroach.Blog.Backend.Api.Configuration;

public class PostConfigureCorsOptions : IPostConfigureOptions<CorsOptions>
{
    private readonly FrontendOptions _frontendOptions;

    public PostConfigureCorsOptions(IOptions<FrontendOptions> frontendOptions)
    {
        _frontendOptions = frontendOptions.Value;
    }

    public void PostConfigure(string? name, CorsOptions options)
    {
        options.AddPolicy(CorsConstants.DefaultPolicy, x =>
        {
            x.WithOrigins(_frontendOptions.Url);
        });
    }
}