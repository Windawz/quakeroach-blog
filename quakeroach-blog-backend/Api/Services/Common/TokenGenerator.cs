using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface ITokenGenerator
{
    (string AccessToken, RefreshToken RefreshToken) Generate(User user);
}

public class TokenGenerator : ITokenGenerator
{
    public (string AccessToken, RefreshToken RefreshToken) Generate(User user)
    {
        throw new NotImplementedException();
    }
}