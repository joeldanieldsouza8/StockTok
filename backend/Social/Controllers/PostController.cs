using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Posts.Services;
using Social.Data;
using Social.Models;
using Social.Utilities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Social.Controllers
{
    [ApiController]
    [EnableCors("_myAllowSpecificOrigins")]
    [Route("api/posts")]
    [Authorize]
    public class PostController : ControllerBase
    {
        private readonly PostDBContext _context;
        private readonly PostsService _postsService;

        public PostController(PostDBContext context, PostsService postsService)
        {
            _context = context;
            _postsService = postsService;
        }

        [HttpPost]
        public async Task<ActionResult<Post>> createPost(Post post)
        {
            if (string.IsNullOrEmpty(post.id))
            {
                post.id = System.Guid.NewGuid().ToString();
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(getOnePost), new { id = post.id }, post);
        }

        [EnableCors("_myAllowSpecificOrigins")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> getOnePost(string id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }
            return post;
        }


        // GET: api/posts?ticker=TSLA
        [HttpGet]
        public async Task<IActionResult> GetAllPosts([FromQuery] string? ticker)
        {
            // If a ticker is provided, use the service to filter
            if (!string.IsNullOrEmpty(ticker))
            {
                var filteredPosts = await _postsService.GetPostsAsync(ticker);
                return Ok(filteredPosts);
            }

            // Otherwise, return everything from the DB
            var allPosts = await _context.Posts.ToListAsync();
            return Ok(allPosts);
        }


        [EnableCors("_myAllowSpecificOrigins")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> deletePost(string id)
        {
            var post = await _context.Posts.FindAsync(id);
            
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PostExists(string id)
        {
            return _context.Posts.Any(e => e.id == id);
        }
    }
}
