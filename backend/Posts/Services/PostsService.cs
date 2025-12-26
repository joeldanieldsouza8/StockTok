using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore; // Required for ToListAsync, FirstOrDefaultAsync
using Posts.Data;
using Posts.DTOs.Posts;
using Posts.Hubs; // Import DTOs
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
        var newPost = new Post
        {
            Id = Guid.NewGuid(), 
            Title = createPostDto.Title,
            Body = createPostDto.Body,
            Ticker = createPostDto.Ticker,
            AuthorId = authorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(newPost);
        await _context.SaveChangesAsync();
        
        var newPostDto = MapToDto(newPost);
        
        await _hubContext.Clients.Group($"TICKER_{createPostDto.Ticker}")
            .SendAsync("ReceiveNewPost", newPostDto);
        
        return newPostDto;
    }

    public async Task<List<PostResponseDto>> GetPostsAsync(string ticker)
    {
        var query = _context.Posts.AsNoTracking().AsQueryable();

        if (!string.IsNullOrEmpty(ticker))
        {
            query = query.Where(p => p.Ticker == ticker);
        }

        var posts = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        
        return posts.Select(MapToDto).ToList();
    }

    public async Task<PostResponseDto> GetPostByIdAsync(Guid id)
    {
        var post = await _context.Posts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

        return post != null ? MapToDto(post) : new PostResponseDto();
    }

    public async Task<PostResponseDto> UpdatePostAsync(Guid id, UpdatePostDto updateDto, string authorId)
    {
        var post = await _context.Posts.FindAsync(id);
        
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
        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        var updatePostDto =  MapToDto(post);
        
        await _hubContext.Clients.Group($"TICKER_{post.Ticker}")
            .SendAsync("UpdatePost", updatePostDto);
        
        return updatePostDto;
    }

    public async Task<bool> DeletePostAsync(Guid id, string authorId)
    {
        var post = await _context.Posts.FindAsync(id);
        
        if (post == null) return false;

        if (post.AuthorId != authorId)
        {
            throw new UnauthorizedAccessException("You do not own this post.");
        }
        
        var ticker = post.Ticker; 

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        
        await _hubContext.Clients.Group($"TICKER_{ticker}")
            .SendAsync("DeletePost", id);
        
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