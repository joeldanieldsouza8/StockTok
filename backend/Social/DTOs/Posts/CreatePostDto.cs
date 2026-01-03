namespace Posts.DTOs.Posts;

public class CreatePostDto
{

    public string Id { get; set; } = string.Empty;

    public string Username {  get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    
    public string Body { get; set; } = string.Empty;
    
    public string Ticker { get; set; } = string.Empty;
}