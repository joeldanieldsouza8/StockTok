namespace Posts.DTOs;

public class CreateCommentDto
{
    public string Body { get; set; } = string.Empty;
    
    // Foreign Key
    public Guid PostId { get; set; }
}