using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Logic;

public interface IContentPieceConverter
{
    int GetLength(ContentPiece piece);

    string Format(ContentPiece piece);

    ContentPiece Parse(string rawValue);
}

public class ContentPieceConverter : IContentPieceConverter
{
    public int GetLength(ContentPiece piece)
    {
        return piece switch
        {
            TextContentPiece textPiece => textPiece.Text.Length,
            ReferenceContentPiece => 1,
            _ => throw new ArgumentOutOfRangeException(nameof(piece), piece, null),
        };
    }

    public string Format(ContentPiece piece)
    {


        return piece switch
        {
            TextContentPiece textPiece => textPiece.Text,
            ReferenceContentPiece referencePiece => throw new NotImplementedException(),
        };
    }

    public ContentPiece Parse(string rawValue)
    {
        throw new NotImplementedException();
    }

    private static int GetContentPieceLength(ContentPiece piece)
    {
        return piece switch
        {
            TextContentPiece textPiece => textPiece.Text.Length,
            ReferenceContentPiece => 1,
            _ => throw new ArgumentOutOfRangeException(nameof(piece), piece, null),
        };
    }

    private static string GetReferencePieceKind(ReferenceContentPiece piece)
    {
        return piece switch
        {
            FileContentPiece => "file",
            ImageContentPiece => "image",
            _ => throw new ArgumentOutOfRangeException(nameof(piece), piece, null),
        };
    }
}