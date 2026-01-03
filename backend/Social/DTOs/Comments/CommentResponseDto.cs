namespace Posts.DTOs.Comments;

public class CommentResponseDto
{
    public string Id { get; set; }
    
    public string Body { get; set; } = string.Empty;
    
    public string AuthorId { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; }
    
    // Foreign Keys
    public string PostId { get; set; }
}