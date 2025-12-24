// ...existing code...
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiGateway.Controllers;

[ApiController]
[Route("[controller]")]
public class DummyController : ControllerBase
{
    // GET /dummy
    // Requires a valid Auth0 JWT in the Authorization: Bearer <token> header
    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value });
        return Ok(new
        {
            message = "ApiGateway /dummy - authenticated",
            user = User.Identity?.Name,
            isAuthenticated = User.Identity?.IsAuthenticated,
            claims
        });
    }
}
// ...existing code...