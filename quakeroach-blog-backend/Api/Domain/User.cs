namespace Quakeroach.Blog.Backend.Api.Domain;

public record User(
    string Name,
    string PasswordHash,
    UserFlags Flags) : Entity;

[Flags]
public enum UserFlags
{
    None = 0b0,
    PasswordChangeRequired = 0b1,
}