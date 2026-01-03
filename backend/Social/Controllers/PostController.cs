using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
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
    [EnableCors("_myAllowSpecificOrigins")]
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly PostDBContext _context;
        private readonly PostsService _postsService;

        public PostController(PostDBContext context, PostsService postsService)
        {
            _context = context;
            _postsService = postsService;
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

        [EnableCors("_myAllowSpecificOrigins")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> getPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        // GET: api/posts?ticker=TSLA
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] string ticker)
        {
            var posts = await _postsService.GetPostsAsync(ticker);

            return Ok(posts);
        }

        [EnableCors("_myAllowSpecificOrigins")]
        [HttpPost]
        public async Task<ActionResult<Post>> sendPost(Post post)
        {
            post.id = Utility.generateSalt();
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(getOnePost), new { id = post.id }, post);
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
