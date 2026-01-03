namespace Posts.DTOs.Comments;

public class CreateCommentDto
{
    public string Content { get; set; } = string.Empty; // Changed from Body to Content
    
    // Foreign Key
    public string PostId { get; set; } = string.Empty;
}