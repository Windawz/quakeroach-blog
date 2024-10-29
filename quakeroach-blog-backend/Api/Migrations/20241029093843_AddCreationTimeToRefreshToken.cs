﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Quakeroach.Blog.Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCreationTimeToRefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "RefreshTokens",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "RefreshTokens");
        }
    }
}
