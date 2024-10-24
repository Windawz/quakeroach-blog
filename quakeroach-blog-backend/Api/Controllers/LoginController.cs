using Microsoft.AspNetCore.Mvc;
using Quakeroach.Blog.Backend.Api.Services.TopLevel;

namespace Quakeroach.Blog.Backend.Api.Controllers;

[Route("api")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly LoginService _loginService;

    public LoginController(LoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("login")]
    public async Task<LoginOutput> Login([FromBody] LoginInput input)
    {
        return await _loginService.LoginAsync(input);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterInput input)
    {
        await _loginService.RegisterAsync(input);

        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<RefreshOutput> Refresh([FromBody] RefreshInput input)
    {
        return await _loginService.RefreshAsync(input);
    }
}