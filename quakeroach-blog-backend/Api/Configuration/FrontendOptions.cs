using Microsoft.Extensions.Options;

namespace Quakeroach.Blog.Backend.Api.Configuration;

public class FrontendOptions
{
    public const string Section = "Frontend";

    public required string Url { get; set; }
}

public class ConfigureFrontendOptions : IConfigureOptions<FrontendOptions>
{
    private readonly IConfiguration _configuration;

    public ConfigureFrontendOptions(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(FrontendOptions options)
    {
        var frontendSection = _configuration.GetRequiredSection(FrontendOptions.Section);
        
        frontendSection.Bind(options);
    }
}