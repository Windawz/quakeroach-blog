namespace Quakeroach.Blog.Backend.Api.Domain;

public abstract record ContentPiece;

public record TextContentPiece(string Text) : ContentPiece;

public abstract record ReferenceContentPiece(long Id) : ContentPiece;

public record ImageContentPiece(long Id) : ReferenceContentPiece(Id);

public record FileContentPiece(long Id) : ReferenceContentPiece(Id);