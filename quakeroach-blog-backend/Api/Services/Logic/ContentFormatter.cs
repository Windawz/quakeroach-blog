using System.Text;
using Microsoft.Extensions.Options;
using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Logic;

public interface IContentFormatter
{
    string Format(Content content);

    string FormatShort(Content content);
}

public record ContentFormatterOptions(int MaxLength, string CutoffText);

public class ContentFormatter : IContentFormatter
{
    private readonly IContentPieceFormatter _pieceFormatter;
    private readonly ContentFormatterOptions _options;

    public ContentFormatter(
        IContentPieceFormatter pieceFormatter,
        IOptions<ContentFormatterOptions> options)
    {
        _pieceFormatter = pieceFormatter;
        _options = options.Value;
    }

    public string Format(Content content)
    {
        return FormatGeneric(content, null);
    }

    public string FormatShort(Content content)
    {
        return FormatGeneric(content, _options.MaxLength);
    }

    private string FormatGeneric(Content content, int? maxLength)
    {
        int currentLength = 0;
        var result = new StringBuilder();

        foreach (var piece in content.Pieces)
        {
            int appendedLength = _pieceFormatter.GetLength(piece) + result.Length > 0 ? 1 : 0;

            if (maxLength is not null && currentLength + appendedLength > maxLength.Value - _options.CutoffText.Length)
            {
                result.Append(_options.CutoffText);
                currentLength += _options.CutoffText.Length;
                break;
            }

            string appendedText = (result.Length > 0 ? " " : "") + _pieceFormatter.Format(piece);

            result.Append(appendedText);
            currentLength += appendedLength;
        }

        return result.ToString();
    }
}