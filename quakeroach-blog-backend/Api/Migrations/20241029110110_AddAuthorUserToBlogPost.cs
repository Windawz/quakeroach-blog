using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quakeroach.Blog.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthorUserToBlogPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "AuthorUserId",
                table: "BlogPosts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEGg9XIMOB/2o/IBrI0q6RjD01CPNkFj8ZKWGYCtBBRS0gOLmEz/tk1i2vAI8chzMLQ==");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_AuthorUserId",
                table: "BlogPosts",
                column: "AuthorUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BlogPosts_Users_AuthorUserId",
                table: "BlogPosts",
                column: "AuthorUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlogPosts_Users_AuthorUserId",
                table: "BlogPosts");

            migrationBuilder.DropIndex(
                name: "IX_BlogPosts_AuthorUserId",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "AuthorUserId",
                table: "BlogPosts");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEGvEAf4NXsiltzHVtCjp28ucEoe1Tixx8aybLViybqRuE7oCyoI2xmGGbEYUHWiL6g==");
        }
    }
}
