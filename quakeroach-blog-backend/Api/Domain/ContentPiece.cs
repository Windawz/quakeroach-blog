namespace Quakeroach.Blog.Backend.Api.Domain;

public abstract record ContentPiece;

public record TextContentPiece(string Text) : ContentPiece;

public abstract record ReferenceContentPiece : ContentPiece
{
    private readonly long _id;

    public ReferenceContentPiece(long id)
    {
        Id = id;
    }

    public long Id
    {
        get => _id;
        init
        {
            ArgumentOutOfRangeException.ThrowIfNegative(value);
            _id = value;
        }
    }

    public void Deconstruct(out long id)
    {
        id = Id;
    }
}

public record ImageContentPiece(long Id) : ReferenceContentPiece(Id);

public record FileContentPiece(long Id) : ReferenceContentPiece(Id);