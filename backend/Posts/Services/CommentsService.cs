using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Posts.Data;
using Posts.DTOs.Comments;
using Posts.Hubs;
using Posts.Models;

namespace Posts.Services;

public class CommentsService
{
    private readonly PostsDbContext _context;
    private readonly IHubContext<CommentHub> _hubContext;

    public CommentsService(PostsDbContext context, IHubContext<CommentHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }
    
    public async Task<CommentResponseDto> CreateCommentAsync(CreateCommentDto createCommentDto, string authorId)
    {
        // Verify that the post exists
        var postExists = await _context.Posts
            .AnyAsync(p => p.Id == createCommentDto.PostId);
        
        // Guard clause
        if (!postExists)
        {
            throw new KeyNotFoundException($"Post with ID {createCommentDto.PostId} not found.");
        }

        // Create the comment
        var newComment = new Comment
        {
            Id = Guid.NewGuid(),
            PostId = createCommentDto.PostId,
            Body = createCommentDto.Body,
            AuthorId = authorId, 
        };

        // Save the comment to the database
        _context.Comments.Add(newComment);
        await _context.SaveChangesAsync();

        var newCommentResponseDto = MapToDto(newComment);
        
        // // Notify the group
        // await _hubContext.Clients.Group($"POST_{createCommentDto.PostId}")
        //     .SendAsync("ReceiveComment", newCommentResponseDto);

        return newCommentResponseDto;
    }
    
    public async Task<List<CommentResponseDto>> GetCommentsByPostIdAsync(Guid postId)
    {
        return await _context.Comments
            .AsNoTracking() 
            .Where(c => c.PostId == postId)
            .OrderByDescending(c => c.CreatedAt) 
            .Select(c => new CommentResponseDto
            {
                Id = c.Id,
                Body = c.Body,
                AuthorId = c.AuthorId,
                PostId = c.PostId,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, string authorId)
    {
        // Find the comment in the database
        var comment = await _context.Comments
            .FindAsync(commentId);
        
        if (comment == null)
        {
            return false;
        }

        // Check if the user is authorised
        if (comment.AuthorId != authorId)
        {
            throw new UnauthorizedAccessException("You do not own this comment.");
        }
        
        var postId = comment.PostId;

        // Remove the comment from the database
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        // await _hubContext.Clients.Group($"POST_{postId}")
        //     .SendAsync("DeleteComment", commentId);

        return true;
    }
    
    public async Task<CommentResponseDto> UpdateCommentAsync(Guid commentId, UpdateCommentDto updateDto, string userId)
    {
        // Query the database for the comment
        var existingComment = await _context.Comments.FindAsync(commentId);

        // Check if the comment is not found 
        if (existingComment == null)
        {
            return new CommentResponseDto();
        }

        // Check if this is the authorised user
        if (existingComment.AuthorId != userId)
        {
            throw new UnauthorizedAccessException("You do not own this comment.");
        }

        existingComment.Body = updateDto.Body;
        existingComment.UpdatedAt = DateTime.UtcNow;

        // Save the updated record to the database
        await _context.SaveChangesAsync();

        var updatedCommentDto = MapToDto(existingComment);
        
        // Notify the group
        // await _hubContext.Clients.Group($"POST_{existingComment.PostId}")
        //     .SendAsync("UpdateComment", updatedCommentDto);

        return updatedCommentDto;
    }
    
    private static CommentResponseDto MapToDto(Comment comment)
    {
        return new CommentResponseDto
        {
            Id = comment.Id,
            Body = comment.Body,
            AuthorId = comment.AuthorId,
            PostId = comment.PostId,
            CreatedAt = comment.CreatedAt
        };
    }
}