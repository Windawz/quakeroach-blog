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
}