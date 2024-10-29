using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;

namespace Quakeroach.Blog.Backend.Api.Controllers;

[Route("api")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService loginService)
    {
        _authService = loginService;
    }

    [HttpPost("login")]
    public async Task<LoginOutput> Login([FromBody] LoginInput input)
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
    public async Task<RefreshOutput> Refresh([FromBody] RefreshInput input)
    {
        return await _authService.RefreshAsync(input);
    }
}