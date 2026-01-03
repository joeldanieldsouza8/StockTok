using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore; 
using Posts.Data;
using Posts.DTOs.Posts;
using Posts.Hubs; 
using Posts.Models;

namespace Posts.Services;

public class PostsService
{
    private readonly PostsDbContext _context;
    private readonly IHubContext<CommentHub> _hubContext;
    
    public PostsService(PostsDbContext context, IHubContext<CommentHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }
    
    public async Task<PostResponseDto> CreatePostAsync(CreatePostDto createPostDto, string authorId)
    {
        // Create the record for the new post
        var newPost = new Post
        {
            Id = Guid.NewGuid().ToString(), 
            Title = createPostDto.Title,
            Body = createPostDto.Body,
            Ticker = createPostDto.Ticker,
            AuthorId = authorId,
            CreatedAt = DateTime.UtcNow.ToString(),
            UpdatedAt = DateTime.UtcNow.ToString()
        };

        // Save the post to the database
        _context.Posts.Add(newPost);
        await _context.SaveChangesAsync();
        
        // Map the post from the entity type to the dto type
        var newPostDto = MapToDto(newPost);
        
        // // Add the post to the group
        // await _hubContext.Clients.Group($"TICKER_{createPostDto.Ticker}")
        //     .SendAsync("ReceiveNewPost", newPostDto);
        
        return newPostDto;
    }

    public async Task<List<PostResponseDto>> GetAllPostsBySymbolAsync(string ticker)
    {
        // Query the database for all the posts by the ticker
        var posts = await _context.Posts
            .AsNoTracking()
            .Where(x => x.Ticker == ticker)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
        
        return posts
            .Select(MapToDto)
            .ToList();
    }

    public async Task<PostResponseDto> GetPostByIdAsync(string id)
    {
        // Query the database for the post
        var post = await _context.Posts
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        return post != null ? MapToDto(post) : new PostResponseDto();
    }

    public async Task<PostResponseDto> UpdatePostByIdAsync(Guid id, UpdatePostDto updateDto, string authorId)
    {
        // Query the database for the post
        var post = await _context.Posts
            .FindAsync(id);
        
        if (post == null)
        {
            return new PostResponseDto();
        }

        if (post.AuthorId != authorId)
        {
            throw new UnauthorizedAccessException("You do not own this post.");
        }

        post.Title = updateDto.Title;
        post.Body = updateDto.Body;
        post.UpdatedAt = DateTime.UtcNow.ToString();

        await _context.SaveChangesAsync();
        
        var updatePostDto =  MapToDto(post);
        
        // await _hubContext.Clients.Group($"TICKER_{post.Ticker}")
        //     .SendAsync("UpdatePost", updatePostDto);
        
        return updatePostDto;
    }

    public async Task<bool> DeletePostByIdAsync(Guid id, string authorId)
    {
        // Query the database for the post
        var post = await _context.Posts
            .FindAsync(id);
        
        if (post == null)
        {
            return false;
        }

        if (post.AuthorId != authorId)
        {
            throw new UnauthorizedAccessException("You do not own this post.");
        }
        
        var ticker = post.Ticker; 

        // Remove the post from the database
        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        
        // // Notify the group
        // await _hubContext.Clients.Group($"TICKER_{ticker}")
        //     .SendAsync("DeletePost", id);
        
        return true;
    }

    private static PostResponseDto MapToDto(Post post)
    {
        return new PostResponseDto
        {
            Id = post.Id,
            Title = post.Title,
            Body = post.Body,
            Ticker = post.Ticker,
            AuthorId = post.AuthorId,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt
        };
    }
}