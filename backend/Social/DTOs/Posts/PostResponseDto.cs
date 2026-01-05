using Posts.DTOs.Comments;

namespace Posts.DTOs.Posts;

public class PostResponseDto
{
    public string Id { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
    
    public string Title { get; set; } = string.Empty;
    
    public string Body { get; set; } = string.Empty;
    
    public string Ticker { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; }
    
    // Foreign Keys
    public string AuthorId { get; set; } = string.Empty;

    public List<CommentResponseDto> Comments { get; set; } = new();
}   