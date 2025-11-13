using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using News.Services;

namespace News.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase

    // instantiating service
    {
        private readonly NewsApiClient _newsApiClient;
        public NewsController(NewsApiClient newsApiClient)
        {
            _newsApiClient = newsApiClient;
        }

        // Get controller to fetch response from API (assume we are calling from API database instead)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _newsApiClient.GetNewsAsync();
            return Ok(data);
        }
    }
}