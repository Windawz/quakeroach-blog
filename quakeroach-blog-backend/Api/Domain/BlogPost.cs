namespace Quakeroach.Blog.Backend.Api.Domain;

public class BlogPost : Entity
{
    public required string Title { get; set; }

    public required User AuthorUser { get; set; }

    public required DateTime PublishDate { get; set; }
    
    public required string Content { get; set; }

    public List<Comment> Comments { get; set; } = [];
}