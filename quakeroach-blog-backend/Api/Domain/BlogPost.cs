namespace Quakeroach.Blog.Backend.Api.Domain;

public record BlogPost(
    User Author,
    string Title,
    DateTime PublishDate,
    Content Content) : Entity;
