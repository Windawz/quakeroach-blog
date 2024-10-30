using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quakeroach.Blog.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshTokenExpirationTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationTime",
                table: "RefreshTokens",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAECZANshr/HOYUw96jU0QTRMRnZhllvbSgZs/R4WrXQn/+i2XLJmiSXsQVTVdlHio3A==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpirationTime",
                table: "RefreshTokens");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEGg9XIMOB/2o/IBrI0q6RjD01CPNkFj8ZKWGYCtBBRS0gOLmEz/tk1i2vAI8chzMLQ==");
        }
    }
}
