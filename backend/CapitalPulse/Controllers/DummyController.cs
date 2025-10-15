using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CapitalPulse.Controllers;

[Authorize]
[ApiController]
[Route("dummy")]
public class DummyController : ControllerBase
{
    [HttpGet]
    public IActionResult GetDummy()
    {
        return Ok(new { message = "Hey there!" });
    }
}