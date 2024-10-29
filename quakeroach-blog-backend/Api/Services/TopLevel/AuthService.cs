using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Exceptions;
using Quakeroach.Blog.Backend.Api.Services.Common;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface IAuthService
{
    Task<LoginOutput> LoginAsync(LoginInput input);

    Task RegisterAsync(RegisterInput input);

    Task<RefreshOutput> RefreshAsync(RefreshInput input);
}

public record LoginInput(string UserName, string PasswordText);

public record LoginOutput(string AccessToken, string RefreshToken);

public record RegisterInput(string UserName, string PasswordText);

public record RefreshInput(string RefreshToken);

public record RefreshOutput(string AccessToken, string RefreshToken);

public class AuthService : IAuthService
{
    private readonly MainDbContext _dbContext;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IAccessTokenOperator _accessTokenOperator;
    private readonly IRefreshTokenOperator _refreshTokenOperator;

    public AuthService(
        MainDbContext dbContext,
        IPasswordHasher<User> passwordHasher,
        IAccessTokenOperator accessTokenOperator,
        IRefreshTokenOperator refreshTokenOperator)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _accessTokenOperator = accessTokenOperator;
        _refreshTokenOperator = refreshTokenOperator;
    }

    public async Task<LoginOutput> LoginAsync(LoginInput input)
    {
        var (userName, passwordText) = input;
        
        var user = await _dbContext.Users
            .Where(x => x.Name == userName)
            .SingleOrDefaultAsync();

        if (user is null)
        {
            throw new InvalidUserCredentialsException();
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            passwordText);
        
        if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            await _dbContext.Users
                .Where(x => x.Id == user.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(x => x.Flags, x => x.Flags | UserFlags.PasswordRehashRequired));
        }

        if (verificationResult == PasswordVerificationResult.Failed)
        {
            throw new InvalidUserCredentialsException();
        }

        var accessToken = _accessTokenOperator.Create(user);
        var refreshToken = await _refreshTokenOperator.CreateAsync(user);

        return new LoginOutput(
            accessToken,
            _refreshTokenOperator.Format(refreshToken));
    }

    public async Task RegisterAsync(RegisterInput input)
    {
        var (userName, passwordText) = input;

        var user = new User
        {
            Name = userName,
            PasswordHash = passwordText,
            Flags = UserFlags.None,
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, passwordText);

        bool alreadyExists = await _dbContext.Users
            .AnyAsync(x => x.Name == userName);
        
        if (alreadyExists)
        {
            throw new UserAlreadyExistsException(userName);
        }

        _dbContext.Add(user);

        await _dbContext.SaveChangesAsync();
    }

    public async Task<RefreshOutput> RefreshAsync(RefreshInput input)
    {
        var refreshToken = (await _refreshTokenOperator.BindAsync(input.RefreshToken))
            ?? throw new InvalidRefreshTokenException();

        var user = refreshToken.User;
        
        await _refreshTokenOperator.DestroyAsync(refreshToken);

        var newAccessToken = _accessTokenOperator.Create(user);
        var newRefreshToken = await _refreshTokenOperator.CreateAsync(user);
        
        return new RefreshOutput(
            newAccessToken,
            _refreshTokenOperator.Format(newRefreshToken));
    }
}