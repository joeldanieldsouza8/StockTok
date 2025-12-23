using Posts.Data;
using Posts.Models;

namespace Posts.Services;

public class PostsService
{
    private readonly PostsDbContext _context;
    
    public PostsService(PostsDbContext context)
    {
        _context = context;
    }
    
    public async Task<Guid> CreatePostAsync(Post post)
    {
        // Save the post to the database
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return post.Id;
    }
}