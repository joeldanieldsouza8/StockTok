using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Social.Models;
using Social.Utilities;

namespace Social.Controllers
{
    [EnableCors("_myAllowSpecificOrigins")]
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly PostDBContext _context;

        public PostController(PostDBContext context)
        {
            _context = context;
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
