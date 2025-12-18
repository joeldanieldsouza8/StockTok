using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace Social.Models
{
    public class Post
    {

        [Key]
        public String? id { get; set; }

        public String username { get; set; }

        public String title { get; set; }

        public String description { get; set; }

        public DateTime time_created { get; set; }

        public String ticker { get; set; }
    }
}
