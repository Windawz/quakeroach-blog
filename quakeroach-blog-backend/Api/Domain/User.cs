namespace Quakeroach.Blog.Backend.Api.Domain;

public record User(string Name, byte[] PasswordHash) : Entity;