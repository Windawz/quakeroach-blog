using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface ITokenFormatter
{
    string FormatRefreshToken(RefreshToken value);

    RefreshToken? ParseRefreshToken(string value);
}

public class TokenFormatter : ITokenFormatter
{
    public string FormatRefreshToken(RefreshToken value)
    {
        throw new NotImplementedException();
    }

    public RefreshToken? ParseRefreshToken(string value)
    {
        throw new NotImplementedException();
    }
}