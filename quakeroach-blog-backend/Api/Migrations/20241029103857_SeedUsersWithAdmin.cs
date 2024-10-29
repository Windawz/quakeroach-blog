using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quakeroach.Blog.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedUsersWithAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Flags", "Name", "PasswordHash" },
                values: new object[] { -1L, 1, "root", "AQAAAAIAAYagAAAAEGvEAf4NXsiltzHVtCjp28ucEoe1Tixx8aybLViybqRuE7oCyoI2xmGGbEYUHWiL6g==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L);
        }
    }
}
