using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> CreatePostAsync([FromBody] Comment comment)
    {
        var newComment = await _commentsService.CreateCommentAsync(comment);

        return CreatedAtAction(nameof(GetCommentByPost), new { postId = comment.PostId }, comment);
    }
}