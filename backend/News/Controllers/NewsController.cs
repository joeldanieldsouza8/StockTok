using Microsoft.AspNetCore.Mvc;
using News.Services;

namespace News.Controllers;

[ApiController] 
[Route("api/[controller]")] 
public class NewsController : ControllerBase
{
    private readonly NewsService _newsService;
    
    public NewsController(NewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllNewsBySymbolsAsync([FromQuery] List<string>symbols)
    {
        symbols = symbols.Select(s => s.ToUpper()).ToList();

        var articles = await _newsService.GetAllNewsBySymbolsAsync(symbols);

        return Ok(articles);
    }
}