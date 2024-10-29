using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Quakeroach.Blog.Backend.Api.Configuration;
using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IAccessTokenOperator
{
    string Create(User user);
}

public class AccessTokenOperator : IAccessTokenOperator
{
    private readonly AuthOptions _authOptions;

    public AccessTokenOperator(IOptions<AuthOptions> authOptions)
    {
        _authOptions = authOptions.Value;
    }

    public string Create(User user)
    {
        var now = DateTime.UtcNow;
        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateJwtSecurityToken(
            issuer: _authOptions.Issuer,
            audience: _authOptions.Audience,
            subject: new ClaimsIdentity([
                new Claim(
                    _authOptions.NameClaimType,
                    user.Name),
            ]),
            notBefore: now,
            expires: now + _authOptions.AccessTokenLifeTime,
            issuedAt: now,
            signingCredentials: new SigningCredentials(
                _authOptions.SigningKey,
                SecurityAlgorithms.Sha256));
        
        return tokenHandler.WriteToken(token);
    }
}