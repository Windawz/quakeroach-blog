using System.Text;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Logic;

public interface IContentPieceFormatter
{
    int GetLength(ContentPiece piece);

    string Format(ContentPiece piece);

    ContentPiece Parse(string rawValue);
}

public class ContentPieceFormatter : IContentPieceFormatter
{
    private static Dictionary<string, (Type Type, Func<long, ReferenceContentPiece> Factory)> _referencePieceTypes = new()
    {
        ["file"] = (typeof(FileContentPiece), id => new FileContentPiece(id)),
        ["image"] = (typeof(ImageContentPiece), id => new ImageContentPiece(id)),
    };

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
            ReferenceContentPiece referencePiece => FormatReferencePiece(referencePiece),
            _ => throw new ArgumentOutOfRangeException(nameof(piece), piece, null),
        };
    }

    public ContentPiece Parse(string rawValue)
    {
        if (!TryParseReferencePiece(rawValue, out var referencePiece))
        {
            return new TextContentPiece(rawValue.Trim());
        }

        return referencePiece;
    }

    private static string FormatReferencePiece(ReferenceContentPiece referencePiece)
    {
        string kind = _referencePieceTypes
            .Where(x => x.Value.Type == referencePiece.GetType())
            .Select(x => x.Key)
            .SingleOrDefault()
                ?? throw new ArgumentOutOfRangeException(nameof(referencePiece), referencePiece, null);

        return $"[{kind}:{referencePiece.Id}]";
    }

    private static bool TryParseReferencePiece(string rawValue, out ReferenceContentPiece referencePiece)
    {
        referencePiece = null!;

        int openBracketIndex = rawValue.IndexOf('[');
        if (openBracketIndex == -1)
        {
            return false;
        }

        int separatorIndex = rawValue.IndexOf(':', openBracketIndex);
        if (separatorIndex == -1)
        {
            return false;
        }

        int closeBracketIndex = rawValue.IndexOf(']', separatorIndex);
        if (closeBracketIndex == -1)
        {
            return false;
        }

        string kind;
        try
        {
            kind = rawValue
                .Substring(openBracketIndex + 1, separatorIndex - openBracketIndex - 1)
                .Trim()
                .ToLowerInvariant();
        }
        catch (ArgumentOutOfRangeException)
        {
            return false;
        }

        string idStr;
        try
        {
            idStr = rawValue
                .Substring(separatorIndex + 1, closeBracketIndex - separatorIndex - 1)
                .Trim();
        }
        catch (ArgumentOutOfRangeException)
        {
            return false;
        }

        if (!_referencePieceTypes.TryGetValue(kind, out var pieceTypeInfo))
        {
            return false;
        }

        var factory = pieceTypeInfo.Factory;
        
        if (!long.TryParse(idStr, out long id))
        {
            return false;
        }

        try
        {
            referencePiece = factory(id);
        }
        catch (ArgumentOutOfRangeException)
        {
            return false;
        }

        return true;
    }
}