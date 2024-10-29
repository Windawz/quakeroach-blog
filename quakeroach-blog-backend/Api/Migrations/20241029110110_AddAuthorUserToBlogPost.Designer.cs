﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Quakeroach.Blog.Backend.Api.Storage;

#nullable disable

namespace Quakeroach.Blog.Backend.Api.Migrations
{
    [DbContext(typeof(MainDbContext))]
    [Migration("20241029110110_AddAuthorUserToBlogPost")]
    partial class AddAuthorUserToBlogPost
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.8");

            modelBuilder.Entity("Quakeroach.Blog.Backend.Api.Domain.BlogPost", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long>("AuthorUserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("PublishDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("AuthorUserId");

                    b.ToTable("BlogPosts");
                });

            modelBuilder.Entity("Quakeroach.Blog.Backend.Api.Domain.RefreshToken", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("RefreshTokens");
                });

            modelBuilder.Entity("Quakeroach.Blog.Backend.Api.Domain.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Flags")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = -1L,
                            Flags = 1,
                            Name = "root",
                            PasswordHash = "AQAAAAIAAYagAAAAEGg9XIMOB/2o/IBrI0q6RjD01CPNkFj8ZKWGYCtBBRS0gOLmEz/tk1i2vAI8chzMLQ=="
                        });
                });

            modelBuilder.Entity("Quakeroach.Blog.Backend.Api.Domain.BlogPost", b =>
                {
                    b.HasOne("Quakeroach.Blog.Backend.Api.Domain.User", "AuthorUser")
                        .WithMany()
                        .HasForeignKey("AuthorUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AuthorUser");
                });

            modelBuilder.Entity("Quakeroach.Blog.Backend.Api.Domain.RefreshToken", b =>
                {
                    b.HasOne("Quakeroach.Blog.Backend.Api.Domain.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
