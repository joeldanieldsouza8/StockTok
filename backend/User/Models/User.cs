using System.ComponentModel.DataAnnotations;  // Add for [Required]

namespace User.Models;

public class User
{
    /// <summary>
    /// The unique identifier for the user.
    /// </summary>
<<<<<<< HEAD
    public Guid Id { get; set; } 
    
    /// <summary>
    /// 
    /// </summary>
    [Required]  // Makes it required for validation
    public string Auth0SubjectId { get; set; } = string.Empty;  // Initialize to avoid warning
=======
    public string Id { get; set; } = null!;
>>>>>>> 3877d1fc5ff1d628dad9df22d36789fedf126675
    
    /// <summary>
    /// The user's full display name.
    /// </summary>
    /// <example>Jane Doe</example>
    [Required]
    public string FullName { get; set; } = string.Empty;
    
    /// <summary>
    /// The unique username chosen by the user.
    /// </summary>
    /// <example>janedoe123</example>
    [Required]
    public string Username { get; set; } = string.Empty;
    
    /// <summary>
    /// The user's email.
    /// </summary>
    /// <example>jane.doe@example.com</example>
    [Required]
    public string Email { get; set; } = string.Empty;
    
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