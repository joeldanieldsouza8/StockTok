using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore; 
using Posts.Data;
using Posts.DTOs.Posts;
using Posts.Hubs; 
using Posts.Models;
using Social.Data;
using Social.Models;

using Posts.DTOs.Comments;

namespace Posts.Services;

public class PostsService
{
    private readonly PostDBContext _context;
    private readonly IHubContext<CommentHub> _hubContext;
    
    public PostsService(PostDBContext context, IHubContext<CommentHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<PostResponseDto> CreatePostAsync(CreatePostDto createPostDto, string authorId)
    {
        // Create the record for the new post
        var newPost = new Post
        {
            id = createPostDto.Id,
            username = createPostDto.Username,
            title = createPostDto.Title,
            description = createPostDto.Body,
            time_created = DateTime.UtcNow,
            ticker = createPostDto.Ticker,
            comments = []
        };

    // Save the post to the database
    _context.Posts.Add(newPost);
        await _context.SaveChangesAsync();
        
        // Map the post from the entity type to the dto type
        var newPostDto = MapToDto(newPost);
        
        // Add the post to the group
        await _hubContext.Clients.Group($"TICKER_{createPostDto.Ticker}")
            .SendAsync("ReceiveNewPost", newPostDto);
        
        return newPostDto;
    }

    public async Task<List<PostResponseDto>> GetPostsAsync(string ticker)
    {
        // Query the database for all the posts by the ticker
    var posts = await _context.Posts
        .AsNoTracking()
        .Include(p => p.comments)
        .Where(x => x.ticker == ticker)
        .OrderByDescending(x => x.time_created)
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
            .Include(p => p.comments)
            .FirstOrDefaultAsync(p => p.id == id);

        return post != null ? MapToDto(post) : new PostResponseDto();
    }

    public async Task<PostResponseDto> UpdatePostAsync(Guid id, UpdatePostDto updateDto, string authorId)
    {
        // Query the database for the post
        var post = await _context.Posts
            .FindAsync(id);
        
        if (post == null)
        {
            return new PostResponseDto();
        }

        post.title = updateDto.Title;
        post.description = updateDto.Body;
        post.time_created = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        var updatePostDto =  MapToDto(post);
        
        await _hubContext.Clients.Group($"TICKER_{post.ticker}")
            .SendAsync("UpdatePost", updatePostDto);
        
        return updatePostDto;
    }

    public async Task<bool> DeletePostAsync(Guid id, string authorId)
    {
        // Query the database for the post
        var post = await _context.Posts
            .FindAsync(id);
        
        if (post == null)
        {
            return false;
        }

        
        var ticker = post.ticker; 

        // Remove the post from the database
        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        
        // Notify the group
        await _hubContext.Clients.Group($"TICKER_{ticker}")
            .SendAsync("DeletePost", id);
        
        return true;
    }

    private static PostResponseDto MapToDto(Post post)
    {
        return new PostResponseDto
        {
            Id = post.id,
            Username = post.username,
            Title = post.title,
            Body = post.description,
            CreatedAt = post.time_created,
            Ticker = post.ticker,

            Comments = post.comments?
                .OrderBy(c => c.CreatedAt)
                .Select(c => new CommentResponseDto
                {
                    Id = c.Id,
                    Content = c.Body,
                    AuthorId = c.AuthorId,
                    PostId = c.PostId,
                    CreatedAt = c.CreatedAt
                })
                .ToList() ?? new()
        };
    }
}