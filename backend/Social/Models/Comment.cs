using Social.Models;

namespace Posts.Models;

public class Comment
{
    public string Id { get; set; } 

    public string Body { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } 
    
    public DateTime UpdatedAt { get; set; }

    // Foreign Keys
    public string PostId { get; set; }
    public string AuthorId { get; set; } = null!;

    // Navigation Property: A Comment belongs to One Post
    public Post Post { get; set; } = null!;
}