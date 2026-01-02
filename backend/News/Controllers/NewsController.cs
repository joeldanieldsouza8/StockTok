using Microsoft.AspNetCore.Mvc;
using News.Services;
using Microsoft.AspNetCore.Authorization;

namespace News.Controllers;

[ApiController] 
[Route("api/news")] // Removed "api/" because YARP handles the prefixing
[Authorize]
public class NewsController : ControllerBase
{
    private readonly NewsService _newsService;
    
    public NewsController(NewsService newsService)
    {
        _newsService = newsService;
    }

    // Changed to accept symbol from the path to match /news/NVDA
    [HttpGet("{symbol}")] 
    public async Task<IActionResult> GetNewsBySymbolAsync(string symbol)
    {
        if (string.IsNullOrEmpty(symbol))
            return BadRequest("No symbol provided");

        var symbolList = new List<string> { symbol.Trim().ToUpper() };

        var articles = await _newsService.GetAllNewsBySymbolsAsync(symbolList);
        return Ok(articles);
    }
}