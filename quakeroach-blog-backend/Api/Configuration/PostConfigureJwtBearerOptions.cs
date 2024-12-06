using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace Quakeroach.Blog.Backend.Api.Configuration;

public class PostConfigureJwtBearerOptions : IPostConfigureOptions<JwtBearerOptions>
{
    private readonly AuthOptions _authOptions;

    public PostConfigureJwtBearerOptions(IOptions<AuthOptions> authOptions)
    {
        _authOptions = authOptions.Value;
    }

    public void PostConfigure(string? name, JwtBearerOptions options)
    {
        var tvp = options.TokenValidationParameters;

        tvp.ValidateIssuer = true;
        tvp.ValidIssuer = _authOptions.Issuer;
        tvp.ValidateAudience = true;
        tvp.ValidAudience = _authOptions.Audience;
        tvp.ValidateLifetime = true;
        tvp.ClockSkew = TimeSpan.Zero;
        
        tvp.IssuerSigningKey = _authOptions.SigningKey;
    }
}