namespace Posts.Models;

public class Post
{
    public string Id { get; set; } =  Guid.NewGuid().ToString();
    
    public string Title { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;

    public string Ticker { get; set; } = string.Empty;
    
    // public int Upvotes { get; set; } 
    
    // public int Downvotes { get; set; } 
    
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString();
    
    public string UpdatedAt { get; set; }
    
    // Foreign Keys
    public string AuthorId { get; set; } = null!;
    
    // Navigation property
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}