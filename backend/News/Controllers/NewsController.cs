using Microsoft.AspNetCore.Mvc;
using News.Services;
using Microsoft.AspNetCore.Authorization;

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
    public async Task<IActionResult> GetAllNewsBySymbolsAsync([FromQuery] string symbols)
    {
        if (string.IsNullOrEmpty(symbols))
            return BadRequest("No symbols provided");

        // Split the string by comma and remove whitespace
        var symbolList = symbols.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(s => s.Trim().ToUpper())
                                .ToList();

        var articles = await _newsService.GetAllNewsBySymbolsAsync(symbolList);
        return Ok(articles);
    }
}