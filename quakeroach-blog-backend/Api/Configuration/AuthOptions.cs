using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Quakeroach.Blog.Backend.Api.Configuration;

public class AuthOptions
{
    public const string Section = "Auth";

    public required string Issuer { get; set; }
    
    public required string Audience { get; set; }

    public required SecurityKey SigningKey { get; set; }

    public required TimeSpan AccessTokenLifeTime { get; set; }

    public required TimeSpan RefreshTokenLifeTime { get; set; }

    public required string NameClaimType { get; set; } = ClaimTypes.Name;
}

public class ConfigureAuthOptions : IConfigureOptions<AuthOptions>
{
    private readonly IConfiguration _configuration;

    public ConfigureAuthOptions(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(AuthOptions options)
    {
        var authSection = _configuration.GetRequiredSection(AuthOptions.Section);
        
        authSection.Bind(options);

        var rawKey = authSection
            .GetRequiredSection(nameof(AuthOptions.SigningKey))
            .Get<string>()
                ?? throw new InvalidOperationException("Raw key not present in configuration");
        
        var keyBytes = Encoding.UTF8.GetBytes(rawKey);

        options.SigningKey = new SymmetricSecurityKey(keyBytes);
    }
}