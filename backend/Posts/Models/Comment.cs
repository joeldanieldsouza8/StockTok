namespace Posts.Models;

public class Comment
{
    public Guid Id { get; set; } 

    public string Body { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } 
    
    public DateTime UpdatedAt { get; set; }

    // Foreign Keys
    public Guid PostId { get; set; }
    public Guid AuthorId { get; set; }

    // Navigation Property: A Comment belongs to One Post
    public Post Post { get; set; } = null!;
}