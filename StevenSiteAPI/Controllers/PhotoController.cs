using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StevenSiteAPI.Data;
using StevenSiteAPI.Models;

namespace StevenSiteAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PhotoController> _logger;
        private readonly IWebHostEnvironment _environment;

        public PhotoController(ApplicationDbContext context, ILogger<PhotoController> logger, IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        // GET: api/photo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Photo>>> GetPhotos()
        {
            try
            {
                var photos = await _context.Photos
                    .OrderByDescending(p => p.UploadedDate)
                    .ToListAsync();
                return Ok(photos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving photos");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/photo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Photo>> GetPhoto(int id)
        {
            try
            {
                var photo = await _context.Photos.FindAsync(id);

                if (photo == null)
                {
                    return NotFound();
                }

                return Ok(photo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving photo with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/photo/5/file
        [HttpGet("{id}/file")]
        public async Task<IActionResult> GetPhotoFile(int id)
        {
            try
            {
                var photo = await _context.Photos.FindAsync(id);

                if (photo == null)
                {
                    return NotFound();
                }

                var filePath = Path.Combine(_environment.WebRootPath, photo.FilePath);
                
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, photo.ContentType ?? "application/octet-stream", photo.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving photo file with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/photo
        [HttpPost]
        public async Task<ActionResult<Photo>> UploadPhoto([FromForm] IFormFile file, [FromForm] string caption)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                if (string.IsNullOrWhiteSpace(caption))
                {
                    return BadRequest("Caption is required");
                }

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return BadRequest("Only image files are allowed");
                }

                // Validate file size (5MB max)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("File size cannot exceed 5MB");
                }

                // Create uploads directory if it doesn't exist
                var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Create photo record
                var photo = new Photo
                {
                    Caption = caption,
                    FileName = file.FileName,
                    FilePath = Path.Combine("uploads", fileName),
                    ContentType = file.ContentType,
                    FileSize = file.Length,
                    UploadedDate = DateTime.UtcNow
                };

                _context.Photos.Add(photo);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPhoto), new { id = photo.Id }, photo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading photo");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/photo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int id)
        {
            try
            {
                var photo = await _context.Photos.FindAsync(id);
                if (photo == null)
                {
                    return NotFound();
                }

                // Delete file from disk
                var filePath = Path.Combine(_environment.WebRootPath, photo.FilePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                _context.Photos.Remove(photo);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting photo with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}