namespace Quakeroach.Blog.Backend.Api.Configuration;

public class JwtBearerAuthOptions
{
    public required string Issuer { get; init; }
    
    public required string Audience { get; init; }

    public required string IssuerSigningKey { get; init; }
}