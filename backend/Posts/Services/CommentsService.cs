using Microsoft.EntityFrameworkCore;
using Posts.Data;
using Posts.Models;

namespace Posts.Services;

public class CommentsService
{
    private readonly PostsDbContext _context;

    public CommentsService(PostsDbContext context)
    {
        _context = context;
    }
    
    public async Task<Comment> CreateCommentAsync(Comment comment)
    {
        // Verify that the post exists
        var postExists = await _context.Posts.AnyAsync(p => p.Id == comment.PostId);
        
        // Guard clause
        if (!postExists)
        {
            
        }

        // Save the comment to the database
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return comment;
    }
}