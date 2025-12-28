namespace Posts.DTOs.Posts;

public class PostResponseDto
{
    public Guid Id { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Body { get; set; } = string.Empty;
    
    public string Ticker { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }
    
    // Foreign Keys
    public string AuthorId { get; set; } = string.Empty;
}