// ...existing code...
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace User.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    // GET /api/users
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetRoot()
    {
        return Ok(new { service = "User", message = "User service is up, Reverse Proxy is working" });
    }

    // GET /api/users/echo-headers
    // returns all headers received by the User service (useful to test transforms)
    [HttpGet("echo-headers")]
    [AllowAnonymous]
    public IActionResult EchoHeaders()
    {
        var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
        return Ok(new { receivedHeaders = headers });
    }
}
