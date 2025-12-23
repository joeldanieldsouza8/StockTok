namespace Posts.DTOs;

public class CreatePostDto
{
    public string Title { get; set; } = string.Empty;
    
    public string Body { get; set; } = string.Empty;
    
    public string Ticker { get; set; } = string.Empty;
}