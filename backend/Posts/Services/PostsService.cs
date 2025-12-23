using Posts.Data;
using Posts.DTOs;
using Posts.Models;

namespace Posts.Services;

public class PostsService
{
    private readonly PostsDbContext _context;
    
    public PostsService(PostsDbContext context)
    {
        _context = context;
    }
    
    public async Task<Post> CreatePostAsync(CreatePostDto createPostDto,  string authorId)
    {
        // Create a new post
        var newPost = new Post
        {
            Id = Guid.NewGuid(), 
            Title = createPostDto.Title,
            Body = createPostDto.Body,
            Ticker = createPostDto.Ticker,
            
            // Foreign Key
            AuthorId = authorId
        };

        // Save the post to the database
        _context.Posts.Add(newPost);
        await _context.SaveChangesAsync();
        
        return newPost; 
    }
}