using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Posts.DTOs.Posts;
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

    // GET: api/posts?ticker=TSLA
    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] string ticker)
    {
        var posts = await _postsService.GetPostsAsync(ticker);
        
        return Ok(posts);
    }

    // GET: api/posts/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPost(Guid id)
    {
        var post = await _postsService.GetPostByIdAsync(id);
        
        if (string.IsNullOrEmpty(post.Id.ToString()))
        {
            return NotFound();
        }
        
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePostAsync([FromBody] CreatePostDto createPostDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var newPost = await _postsService.CreatePostAsync(createPostDto, userId);
        
        return CreatedAtAction(nameof(GetPost), new { id = newPost.Id }, newPost);
    }

    // PUT: api/posts/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdatePostDto updateDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var updatedPost = await _postsService.UpdatePostAsync(id, updateDto, userId);
        
        if (string.IsNullOrEmpty(updatedPost.Id.ToString()))
        {
            return NotFound();
        }
        
        return Ok(updatedPost);
    }

    // DELETE: api/posts/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var success = await _postsService.DeletePostAsync(id, userId);
        
        if (!success)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}