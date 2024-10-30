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
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;
            var expiredRefreshTokens = new List<RefreshToken>();

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            using (var dbQueryScope = _serviceProvider.CreateScope())
            {
                var dbContext = dbQueryScope.ServiceProvider.GetRequiredService<MainDbContext>();
                
                expiredRefreshTokens = await dbContext.RefreshTokens
                    .Where(x => now > x.ExpirationTime)
                    .ToListAsync();
            }

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            using (var destructionScope = _serviceProvider.CreateScope())
            {
                var refreshTokenOperator = destructionScope.ServiceProvider.GetRequiredService<IRefreshTokenOperator>();

                await refreshTokenOperator.DestroyManyAsync(expiredRefreshTokens);
            }

            await Task.Delay(_authOptions.RefreshTokenCleanupInterval, stoppingToken);
        }
    }
}