using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Exceptions;
using Quakeroach.Blog.Backend.Api.Services.Common;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.TopLevel;

public interface ILoginService
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

public class LoginService : ILoginService
{
    private readonly MainDbContext _dbContext;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ITokenFormatter _tokenFormatter;
    private readonly ITokenGenerator _tokenGenerator;

    public LoginService(
        MainDbContext dbContext,
        IPasswordHasher<User> passwordHasher,
        ITokenFormatter tokenFormatter,
        ITokenGenerator tokenGenerator)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _tokenFormatter = tokenFormatter;
        _tokenGenerator = tokenGenerator;
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

        var (accessToken, refreshToken) = _tokenGenerator.Generate(user);

        _dbContext.RefreshTokens.Add(refreshToken);

        await _dbContext.SaveChangesAsync();

        return new LoginOutput(
            accessToken,
            _tokenFormatter.FormatRefreshToken(refreshToken));
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
        var providedName = _tokenFormatter
            .ParseRefreshToken(input.RefreshToken)?.Name
                ?? throw new InvalidRefreshTokenException();

        var providedToken = await _dbContext.RefreshTokens
            .SingleOrDefaultAsync(x => x.Name == providedName)
                ?? throw new InvalidRefreshTokenException();
        
        var user = providedToken.User;

        _dbContext.RefreshTokens.Remove(providedToken);

        await _dbContext.SaveChangesAsync();
        
        var (newAccessToken, newRefreshToken) = _tokenGenerator.Generate(user);

        return new RefreshOutput(
            newAccessToken,
            _tokenFormatter.FormatRefreshToken(newRefreshToken));
    }
}