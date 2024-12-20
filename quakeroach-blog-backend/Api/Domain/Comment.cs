namespace Quakeroach.Blog.Backend.Api.Domain;

public abstract class Comment : Entity
{
    public required BlogPost BlogPost { get; set; }

    public required DateTime PublishDate { get; set; }

    public required string Contents { get; set; }
}

public class AnonymousComment : Comment
{
    public required string AuthorName { get; set; }
}

public class AuthenticatedComment : Comment
{
    public required User Author { get; set; }
}

public static class CommentExtensions
{
    public static string GetAuthorName(this Comment comment)
    {
        return comment switch
        {
            AnonymousComment anonymous => anonymous.AuthorName,
            AuthenticatedComment authenticated => authenticated.Author.Name,
            _ => throw new ArgumentException($"Unknown {nameof(Comment)} subtype", nameof(comment)),
        };
    }
}