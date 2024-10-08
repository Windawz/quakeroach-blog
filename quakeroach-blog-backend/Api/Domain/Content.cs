using System.Collections.Immutable;

namespace Quakeroach.Blog.Backend.Api.Domain;

public record Content(ImmutableList<ContentPiece> Pieces);