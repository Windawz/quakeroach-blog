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
    private readonly ILogger _logger;

    public RefreshTokenCleaner(
        IOptions<AuthOptions> authOptions,
        IServiceProvider serviceProvider,
        ILogger<RefreshTokenCleaner> logger)
    {
        _authOptions = authOptions.Value;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting");

        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Performing cleanup");

            var now = DateTime.UtcNow;
            var expiredRefreshTokens = new List<RefreshToken>();

            if (stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Cancellation requested on cycle start");
                break;
            }

            using (var dbQueryScope = _serviceProvider.CreateScope())
            {
                var dbContext = dbQueryScope.ServiceProvider.GetRequiredService<MainDbContext>();
                
                expiredRefreshTokens = await dbContext.RefreshTokens
                    .Where(x => now > x.ExpirationTime)
                    .ToListAsync();
            }

            _logger.LogInformation($"Found {expiredRefreshTokens.Count} token(s)");

            if (stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Cancellation requested after query");
                break;
            }

            using (var destructionScope = _serviceProvider.CreateScope())
            {
                var refreshTokenOperator = destructionScope.ServiceProvider.GetRequiredService<IRefreshTokenOperator>();

                await refreshTokenOperator.DestroyManyAsync(expiredRefreshTokens);
            }

            _logger.LogInformation("Cleanup has been performed");

            await Task.Delay(_authOptions.RefreshTokenCleanupInterval, stoppingToken);
        }

        _logger.LogInformation("Stopping");
    }
}