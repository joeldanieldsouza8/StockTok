using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace News.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "News");

            migrationBuilder.CreateTable(
                name: "NewsArticles",
                schema: "News",
                columns: table => new
                {
                    Uuid = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsArticles", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "NewsArticleEntity",
                schema: "News",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Symbol = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    Industry = table.Column<string>(type: "text", nullable: false),
                    ArticleID = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsArticleEntity", x => x.ID);
                    table.ForeignKey(
                        name: "FK_NewsArticleEntity_NewsArticles_ArticleID",
                        column: x => x.ArticleID,
                        principalSchema: "News",
                        principalTable: "NewsArticles",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticleEntity_ArticleID",
                schema: "News",
                table: "NewsArticleEntity",
                column: "ArticleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NewsArticleEntity",
                schema: "News");

            migrationBuilder.DropTable(
                name: "NewsArticles",
                schema: "News");
        }
    }
}
