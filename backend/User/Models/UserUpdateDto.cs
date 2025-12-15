namespace User.Models;

public class UserUpdateDto
{
    public string? Auth0SubjectId { get; set; }
    public string? FullName { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
}