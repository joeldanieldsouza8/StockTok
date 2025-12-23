namespace Posts.Models;

public class Post
{
    public Guid Id { get; set; } 
    
    public string Title { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;

    // public string Ticker { get; set; } = string.Empty;
    //
    // public int Upvotes { get; set; } 
    //
    // public int Downvotes { get; set; } 
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }
    
    // Foreign Keys
    public Guid AuthorId { get; set; }
    
    // Navigation property
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}