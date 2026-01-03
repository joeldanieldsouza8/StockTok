namespace Posts.DTOs.Posts;

public class PostResponseDto
{
    public string Id { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    public string Body { get; set; } = string.Empty;
    
    public string Ticker { get; set; } = string.Empty;
    
    public string CreatedAt { get; set; }
    
    public string UpdatedAt { get; set; }
    
    // Foreign Keys
    public string AuthorId { get; set; } = string.Empty;
}