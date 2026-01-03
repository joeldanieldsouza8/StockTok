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
    [HttpGet("post/{postId:string}")]
    public async Task<IActionResult> GetCommentsByPost(string postId)
    {
        var comments = await _commentsService.GetCommentsByPostIdAsync(postId);
        
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
        
        return CreatedAtAction(nameof(GetCommentsByPost), new { id = newComment.Id }, newComment);
    }

    // PUT: api/comments/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateComment(Guid id, [FromBody] UpdateCommentDto updateDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var updatedComment = await _commentsService.UpdateCommentAsync(id, updateDto, userId);
        
        if (string.IsNullOrEmpty(updatedComment.Id.ToString()))
        {
            return NotFound();
        }
        
        return Ok(updatedComment);
    }

    // DELETE: api/comments/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteComment(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var success = await _commentsService.DeleteCommentAsync(id, userId);
        
        if (!success)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}