using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Storage;

public class MainDbContext : DbContext
{
    public MainDbContext(DbContextOptions<MainDbContext> options) : base(options) { }

    public required DbSet<BlogPost> BlogPosts { get; init; }

    public required DbSet<User> Users { get; init; }

    public required DbSet<RefreshToken> RefreshTokens { get; init; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<RefreshToken>().HasIndex(x => x.Name).IsUnique();
    }
}