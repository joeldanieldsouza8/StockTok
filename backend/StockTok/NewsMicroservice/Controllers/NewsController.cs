using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StockTok.NewsMicroservice.Services;

namespace StockTok.NewsMicroservice.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase

        // instantiating service
    {
        private readonly NewsAPIFetcher _newsAPIFetcher;
        public NewsController(NewsAPIFetcher newsAPIFetcher)
        {
            _newsAPIFetcher = newsAPIFetcher;
        }

        // Get controller to fetch response from API (assume we are calling from API database instead)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _newsAPIFetcher.GetAPIResponse();
            return Ok(data);
        }
    }
}
