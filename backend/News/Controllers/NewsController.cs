using Microsoft.AspNetCore.Mvc;
using News.Models;
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

    [HttpGet("{symbol}")]
    public async Task<IActionResult> GetAllNewsBySymbolAsync(string symbol)
    {
        var articles = await _newsService.GetAllNewsBySymbolAsync(symbol.ToUpper());

        return Ok(articles);
    }
}