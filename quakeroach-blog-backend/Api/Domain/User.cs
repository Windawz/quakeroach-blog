namespace Quakeroach.Blog.Backend.Api.Domain;

public record User(long Id, string Name, byte[] PasswordHash);