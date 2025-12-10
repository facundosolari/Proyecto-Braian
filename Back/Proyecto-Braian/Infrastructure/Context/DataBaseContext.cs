using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Context
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ProductSize> ProductSizes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<OrderMessage> OrderMessages { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // -------------------------------
            // PRODUCTO → FOTOS (CONVERTER)
            // -------------------------------
            builder.Entity<Product>()
                .Property(p => p.Fotos)
                .HasConversion(
                    v => string.Join(';', v ?? new List<string>()),
                    v => v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList()
                )
                .Metadata.SetValueComparer(
                    new ValueComparer<List<string>>(
                        (c1, c2) => c1.SequenceEqual(c2),
                        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                        c => c.ToList()
                    )
                );

            // -------------------------------
            // PRODUCT SIZE RELATIONS
            // -------------------------------
            builder.Entity<ProductSize>()
                .HasOne(ps => ps.Product)
                .WithMany(p => p.Sizes)
                .HasForeignKey(ps => ps.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.ProductSize)
                .WithMany(ps => ps.OrderItems)
                .HasForeignKey(oi => oi.ProductSizeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderMessage>()
                .HasOne(om => om.Order)
                .WithMany(o => o.Messages)
                .HasForeignKey(om => om.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>()
                .HasMany(p => p.Categories)
                .WithMany(c => c.Productos);

            // -------------------------------
            // ⭐⭐ CATEGORÍAS JERÁRQUICAS ⭐⭐
            // -------------------------------
            builder.Entity<Category>()
                .HasOne(c => c.ParentCategory)       // Relación con el padre
                .WithMany(c => c.SubCategories)      // El padre tiene muchos hijos
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);  // ¡IMPORTANTE! Para no borrar todo el árbol
        }
    }
}