using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Posts.DTOs.Comments;
using Posts.Services;

namespace Posts.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly CommentsService _commentsService;

    public CommentsController(CommentsService commentsService)
    {
        _commentsService = commentsService;
    }
    
    // GET: api/comments/post/{postId}
    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetAllCommentsByPostIdAsync(string postId)
    {
        var comments = await _commentsService.GetAllCommentsByPostIdAsync(postId);
        
        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCommentAsync([FromBody] CreateCommentDto createCommentDto)
    {
        // Get the user id from the JWT
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Guard clause
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var newComment = await _commentsService.CreateCommentAsync(createCommentDto, userId);
        
        return CreatedAtRoute(nameof(GetAllCommentsByPostIdAsync), new { id = newComment.Id }, newComment);
    }

    // PUT: api/comments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCommentByIdAsync(string id, [FromBody] UpdateCommentDto updateDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var updatedComment = await _commentsService.UpdateCommentByIdAsync(id, updateDto, userId);
        
        if (string.IsNullOrEmpty(updatedComment.Id.ToString()))
        {
            return NotFound();
        }
        
        return Ok(updatedComment);
    }

    // DELETE: api/comments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCommentByIdAsync(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var success = await _commentsService.DeleteCommentByIdAsync(id, userId);
        
        if (!success)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}