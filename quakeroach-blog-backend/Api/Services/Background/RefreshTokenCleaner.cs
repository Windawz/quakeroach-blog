using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Quakeroach.Blog.Backend.Api.Configuration;
using Quakeroach.Blog.Backend.Api.Domain;
using Quakeroach.Blog.Backend.Api.Services.Common;
using Quakeroach.Blog.Backend.Api.Storage;

namespace Quakeroach.Blog.Backend.Api.Services.Background;

public class RefreshTokenCleaner : BackgroundService
{
    private readonly AuthOptions _authOptions;
    private readonly IServiceProvider _serviceProvider;
    private DateTime _lastCleanupTime = DateTime.UtcNow;

    public RefreshTokenCleaner(IOptions<AuthOptions> authOptions, IServiceProvider serviceProvider)
    {
        _authOptions = authOptions.Value;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var now = DateTime.UtcNow;

        if (now - _lastCleanupTime <= _authOptions.RefreshTokenCleanupInterval)
        {
            return;
        }

        var expiredRefreshTokens = new List<RefreshToken>();

        if (stoppingToken.IsCancellationRequested)
        {
            return;
        }

        using (var dbQueryScope = _serviceProvider.CreateScope())
        {
            var dbContext = dbQueryScope.ServiceProvider.GetRequiredService<MainDbContext>();
            
            expiredRefreshTokens = await dbContext.RefreshTokens
                .Where(x => now - x.CreationTime > _authOptions.RefreshTokenLifeTime)
                .ToListAsync();
        }

        if (stoppingToken.IsCancellationRequested)
        {
            return;
        }

        using (var destructionScope = _serviceProvider.CreateScope())
        {
            var refreshTokenOperator = destructionScope.ServiceProvider.GetRequiredService<IRefreshTokenOperator>();

            await refreshTokenOperator.DestroyManyAsync(expiredRefreshTokens);
        }

        _lastCleanupTime = now;
    }
}