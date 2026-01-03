using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using News.Models;
using News.Services;

namespace News.Controllers;

[ApiController] 
[Route("api/[controller]")]
[Authorize]
public class NewsController : ControllerBase
{
    private readonly NewsService _newsService;
    
    public NewsController(NewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet("{ticker}")]
    public async Task<IActionResult> GetAllNewsBySymbolAsync(string ticker)
    {
        var articles = await _newsService.GetAllNewsBySymbolAsync(ticker.ToUpper());

        return Ok(articles);
    }
}