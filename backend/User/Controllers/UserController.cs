// ...existing code...
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using User.Models;
using User.Services;

namespace User.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<UserController> _logger;  // Add logger


    public UserController(UserService userService, ILogger<UserController> logger)  // Inject logger
    {
        _userService = userService;
        _logger = logger;
    }

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

    // POST /api/users - Create a new user
    [HttpPost]
    [ProducesResponseType(typeof(Models.User), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateUser([FromBody] Models.User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var createdUser = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }
        catch (Exception ex)
        {
            return BadRequest("Error creating user: " + ex.Message);
        }
    }

    // GET /api/users/{id} - Get user by ID
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Models.User), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // PUT /api/users/{id} - Update user
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(Models.User), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] Models.UserUpdateDto updatedUser)
    {
        var user = await _userService.UpdateUserAsync(id, updatedUser);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // DELETE /api/users/{id} - Delete user
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }


    [HttpPost("login")]
    [Authorize]
    public async Task<IActionResult> HandleLogin()
    {
        try
        {
            var auth0SubjectId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (string.IsNullOrEmpty(auth0SubjectId))
            {
                _logger.LogWarning("Auth0 subject ID (sub) claim not found in token.");
                return Unauthorized(new { error = "Auth0 subject ID (sub) claim not found in token." });
            }

            _logger.LogInformation("Processing login for Auth0 subject ID: {Auth0SubjectId}", auth0SubjectId);

            var user = await _userService.GetUserByAuth0IdAsync(auth0SubjectId);
            if (user != null)
            {
                _logger.LogInformation("Existing user found for Auth0 subject ID: {Auth0SubjectId}, User ID: {UserId}", auth0SubjectId, user.Id);
                return Ok(user);
            }

            // Create a new user with default values
            var newUser = new Models.User
            {
                Auth0SubjectId = auth0SubjectId,
                FullName = User.FindFirst("name")?.Value ?? "Unknown",
                Username = User.FindFirst("nickname")?.Value ?? "user_" + Guid.NewGuid().ToString("N").Substring(0, 8),
                Email = User.FindFirst("email")?.Value ?? "",
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            var createdUser = await _userService.CreateUserAsync(newUser);

            // Log the new user ID
            _logger.LogInformation("New user created with ID: {UserId} for Auth0 subject ID: {Auth0SubjectId}", createdUser.Id, auth0SubjectId);

            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during login processing for Auth0 subject ID: {Auth0SubjectId}", User.FindFirst("sub")?.Value ?? "unknown");
            return StatusCode(500, new { error = "Internal server error during login.", details = ex.Message });
        }
    }
}
