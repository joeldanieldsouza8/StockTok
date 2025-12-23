using Microsoft.EntityFrameworkCore;
using Posts.Data;
using Posts.DTOs;
using Posts.Models;

namespace Posts.Services;

public class CommentsService
{
    private readonly PostsDbContext _context;

    public CommentsService(PostsDbContext context)
    {
        _context = context;
    }
    
    public async Task<Comment> CreateCommentAsync(CreateCommentDto createCommentDto, string authorId)
    {
        // Verify that the post exists
        var postExists = await _context.Posts.AnyAsync(p => p.Id == createCommentDto.PostId);
        
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

        return newComment;
    }
}