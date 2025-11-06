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
    {
        private readonly NewsAPIFetcher _newsAPIFetcher;
        public NewsController(NewsAPIFetcher newsAPIFetcher)
        {
            _newsAPIFetcher = newsAPIFetcher;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _newsAPIFetcher.GetAPIResponse();
            return Ok(data);
        }
    }
}
