using Microsoft.EntityFrameworkCore;
using Posts.Data.Configurations;
using Posts.Models;
using Social.Models;


namespace Social.Data
{
    public class PostDBContext : DbContext
    {
        public PostDBContext(DbContextOptions options) : base(options)
        {
        }

        protected PostDBContext()
        {
        }

        public DbSet<Post> Posts { get; set; }

        public DbSet<Comment> Comments { get; set; }

        // validation

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            var postEntity = modelBuilder.Entity<Post>();

            postEntity
                .Property(post => post.id)
                .IsRequired();

            postEntity
                .Property(post => post.title)
                .HasMaxLength(100)
                .IsRequired();

            postEntity
                .Property(post => post.description)
                .HasMaxLength(500)
                .IsRequired();

            postEntity
                .Property(post => post.time_created)
                .HasDefaultValueSql("NOW() AT TIME ZONE 'utc'");

            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new PostEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CommentEntityTypeConfiguration());
        }
    }
}
