using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Storage;

public class MainDbContext : DbContext
{
    private readonly IPasswordHasher<User> _passwordHasher;

    public MainDbContext(
        DbContextOptions<MainDbContext> options,
        IPasswordHasher<User> passwordHasher) : base(options)
    {
        _passwordHasher = passwordHasher;
    }

    public required DbSet<BlogPost> BlogPosts { get; init; }

    public required DbSet<User> Users { get; init; }

    public required DbSet<RefreshToken> RefreshTokens { get; init; }

    public required DbSet<Comment> Comments { get; init; }

    public required DbSet<AnonymousComment> AnonymousComments { get; init; }

    public required DbSet<AuthenticatedComment> AuthenticatedComments { get; init; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<RefreshToken>().HasIndex(x => x.Name).IsUnique();

        var rootUser = new User
        {
            Id = -1,
            Flags = UserFlags.PasswordChangeRequired,
            Name = "root",
            PasswordHash = "root",
        };

        rootUser.PasswordHash = _passwordHasher.HashPassword(rootUser, rootUser.PasswordHash);

        modelBuilder.Entity<User>().HasData([rootUser]);
    }
}