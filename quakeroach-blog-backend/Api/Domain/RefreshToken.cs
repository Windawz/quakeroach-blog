namespace Quakeroach.Blog.Backend.Api.Domain;

public class RefreshToken : Entity
{
    public required string Name { get; set; }

    public required User User { get; set; }

    public required DateTime CreationTime { get; set; }
}