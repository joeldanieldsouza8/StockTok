using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> CreatePostAsync([FromBody] Post post)
    {
        var newPost = await _postsService.CreatePostAsync(post);

        return CreatedAtAction(nameof(GetPostByUserAsync), new { id = newPost.PostId }, new { id = newPost.PostId });
    }
    
    
}