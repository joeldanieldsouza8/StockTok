namespace Posts.DTOs.Comments;

public class CommentResponseDto
{
    public string Id { get; set; } = string.Empty;
    
    public string Content { get; set; } = string.Empty;
    
    public string AuthorId { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; }
    
    // Foreign Keys
    public string PostId { get; set; }
}