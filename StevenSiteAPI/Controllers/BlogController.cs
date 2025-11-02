using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StevenSiteAPI.Data;
using StevenSiteAPI.Models;

namespace StevenSiteAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BlogController> _logger;

        public BlogController(ApplicationDbContext context, ILogger<BlogController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/blog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
        {
            try
            {
                var posts = await _context.BlogPosts
                    .OrderByDescending(p => p.CreatedDate)
                    .ToListAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving blog posts");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/blog/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(int id)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(id);

                if (blogPost == null)
                {
                    return NotFound();
                }

                return Ok(blogPost);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving blog post with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/blog
        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlogPost(BlogPost blogPost)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                blogPost.CreatedDate = DateTime.UtcNow;
                _context.BlogPosts.Add(blogPost);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.Id }, blogPost);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/blog/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost(int id, BlogPost blogPost)
        {
            if (id != blogPost.Id)
            {
                return BadRequest();
            }

            try
            {
                var existingPost = await _context.BlogPosts.FindAsync(id);
                if (existingPost == null)
                {
                    return NotFound();
                }

                existingPost.Title = blogPost.Title;
                existingPost.Content = blogPost.Content;
                existingPost.Author = blogPost.Author;
                existingPost.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogPostExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/blog/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(id);
                if (blogPost == null)
                {
                    return NotFound();
                }

                _context.BlogPosts.Remove(blogPost);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        private bool BlogPostExists(int id)
        {
            return _context.BlogPosts.Any(e => e.Id == id);
        }
    }
}