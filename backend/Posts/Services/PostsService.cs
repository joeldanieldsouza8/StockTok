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
    
    public async Task<List<Post>> GetAllPostsAsync()
    {}
}