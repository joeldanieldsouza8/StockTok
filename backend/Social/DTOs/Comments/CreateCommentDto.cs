namespace Posts.DTOs.Comments;

public class CreateCommentDto
{
    public string Content { get; set; } = string.Empty; // Changed from Body to Content
    
    public string Username { get; set; } = string.Empty;  // Add this

    
    // Foreign Key
    public string PostId { get; set; } = string.Empty;
}