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
public class CommentsController : ControllerBase
{
    private readonly CommentsService _commentsService;

    public CommentsController(CommentsService commentsService)
    {
        _commentsService = commentsService;
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateCommentAsync([FromBody] CreateCommentDto createCommentDto)
    {
        // Get the user id from the claims in the JWT
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Guard clause
        if (string.IsNullOrEmpty(userId))
        {
            return NotFound();
        }
        
        var newComment = await _commentsService.CreateCommentAsync(createCommentDto, userId);
            
        return CreatedAtAction(nameof(CreateCommentAsync), new { id = newComment.Id }, newComment);
    }
}