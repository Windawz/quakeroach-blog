namespace Quakeroach.Blog.Backend.Api.Domain;

public record BlogPost(
    string Title,
    DateTime PublishDate,
    string Content) : Entity;
