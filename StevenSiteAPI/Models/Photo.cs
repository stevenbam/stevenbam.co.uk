using System.ComponentModel.DataAnnotations;

namespace StevenSiteAPI.Models
{
    public class Photo
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Caption { get; set; } = string.Empty;
        
        [Required]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        public string FilePath { get; set; } = string.Empty;
        
        public string? ContentType { get; set; }
        
        public long FileSize { get; set; }
        
        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
    }
}