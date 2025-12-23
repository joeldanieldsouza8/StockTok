using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Posts.DTOs;
using Posts.Models;
using Posts.Services;

namespace Posts.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly PostsService _postsService;

    public PostsController(PostsService postsService)
    {
        _postsService = postsService;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePostAsync([FromBody] CreatePostDto createPostDto)
    {
        // Get the user id from the claims in the JWT
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Guard clause
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID is missing from token.");
        }
        
        var newPost = await _postsService.CreatePostAsync(createPostDto, userId);
        
        return CreatedAtAction(nameof(CreatePostAsync), new { id = newPost.Id }, newPost);
    }
}