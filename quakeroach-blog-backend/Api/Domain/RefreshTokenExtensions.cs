namespace Quakeroach.Blog.Backend.Api.Domain;

public static class RefreshTokenExtensions
{
    public static TimeSpan GetTimeUntilExpiration(this RefreshToken refreshToken)
    {
        return refreshToken.ExpirationTime - refreshToken.CreationTime;
    }
}