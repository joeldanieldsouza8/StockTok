namespace User.Models;

public class User
{
    /// <summary>
    /// The unique identifier for the user.
    /// </summary>
    public Guid Id { get; set; } 
    
    /// <summary>
    /// 
    /// </summary>
    public string Auth0SubjectId { get; set; }
    
    /// <summary>
    /// The user's full display name.
    /// </summary>
    /// <example>Jane Doe</example>
    public string FullName {get; set;}
    
    /// <summary>
    /// The unique username chosen by the user.
    /// </summary>
    /// <example>janedoe123</example>
    public string Username { get; set; }
    
    /// <summary>
    /// The user's email.
    /// </summary>
    /// <example>jane.doe@example.com</example>
    public string Email { get; set; }
    
    /// <summary>
    /// The UTC timestamp when the user account was created.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }
    
    /// <summary>
    /// The UTC timestamp when the user account was last updated.
    /// </summary>
    public DateTimeOffset UpdatedAt { get; set; }
    
    public ICollection<Watchlist> Watchlists { get; set; } = new List<Watchlist>();
}