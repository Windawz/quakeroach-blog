using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;

namespace Quakeroach.Blog.Backend.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<TokenPairOutput> Login([FromBody] LoginInput input)
    {
        return await _authService.LoginAsync(input);
    }

    [Authorize]
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterInput input)
    {
        await _authService.RegisterAsync(input);

        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<TokenPairOutput> Refresh([FromBody] RefreshInput input)
    {
        return await _authService.RefreshAsync(input);
    }
}