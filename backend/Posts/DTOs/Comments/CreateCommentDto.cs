namespace Posts.DTOs.Comments;

public class CreateCommentDto
{
    public string Body { get; set; } = string.Empty;
    
    // Foreign Key
    public string PostId { get; set; }
}