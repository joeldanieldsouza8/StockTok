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
    public async Task<IActionResult> GetAllPostsBySymbolAsync([FromQuery] string ticker)
    {
        var posts = await _postsService.GetAllPostsBySymbolAsync(ticker);
        
        return Ok(posts);
    }

    // GET: api/posts/{id}
    [HttpGet("{id}", Name = nameof(GetPostByIdAsync))] 
    public async Task<IActionResult> GetPostByIdAsync(string id)
    {
        var post = await _postsService.GetPostByIdAsync(id);
        
        if (string.IsNullOrEmpty(post.Id))
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
        
        return CreatedAtRoute(nameof(GetPostByIdAsync), new { id = newPost.Id }, newPost);
    }

    // PUT: api/posts/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePostByIdAsync(string id, [FromBody] UpdatePostDto updateDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var updatedPost = await _postsService.UpdatePostByIdAsync(id, updateDto, userId);
        
        if (string.IsNullOrEmpty(updatedPost.Id.ToString()))
        {
            return NotFound();
        }
        
        return Ok(updatedPost);
    }

    // DELETE: api/posts/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePostByIdAsync(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var success = await _postsService.DeletePostByIdAsync(id, userId);
        
        if (!success)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}