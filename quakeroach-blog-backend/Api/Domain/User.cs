namespace Quakeroach.Blog.Backend.Api.Domain;

public class User : Entity
{
    public required string Name { get; set; }

    public required string PasswordHash { get; set; }
    
    public required UserFlags Flags { get; set; } 
}

[Flags]
public enum UserFlags
{
    None = 0b0,
    PasswordChangeRequired = 0b01,
    PasswordRehashRequired = 0b10,
}