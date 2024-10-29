using Quakeroach.Blog.Backend.Api.Domain;

namespace Quakeroach.Blog.Backend.Api.Services.Common;

public interface IAccessTokenOperator
{
    string Create(User user);

    bool IsValid(string token);
}