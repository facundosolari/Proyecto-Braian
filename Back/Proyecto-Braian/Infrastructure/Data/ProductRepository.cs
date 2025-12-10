using Domain.Entities;
using Infrastructure.Context;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Application.Models.Response;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {

        private readonly DataBaseContext _databaseContext;
        private readonly ICategoryRepository _categoryRepository;

        public ProductRepository(DataBaseContext databaseContext, ICategoryRepository categoryRepository)
        {
            _databaseContext = databaseContext;
            _categoryRepository = categoryRepository;
        }

        public List<Product> GetAllProducts()
        {
            return _databaseContext.Products.Include(p => p.Sizes).Include(p => p.Categories).ToList();
        }
        public Product? GetProductById(int id)
        {
            return _databaseContext.Products.Include(p => p.Sizes).Include(p => p.Categories)
                .FirstOrDefault(x => x.Id.Equals(id));
        }
        public List<Product>? GetProductsByIds(List<int> ids)
        {
            return _databaseContext.Products
                .Include(p => p.Sizes).Include(p => p.Categories)
                .Where(p => ids.Contains(p.Id))
                .ToList();
        }
        public Product? GetProductByName(string name)
        {
            return _databaseContext.Products.Include(p => p.Sizes).Include(p => p.Categories)
                .FirstOrDefault(x => x.Nombre.Equals(name));
        }

        public (List<Product> Products, int TotalCount) GetProductsPaginated(
     int page, int pageSize, string? sortBy = null,
     List<int>? categoryIds = null, List<string>? sizeIds = null,
     decimal? minPrice = null, decimal? maxPrice = null,
     bool onlyEnabled = false, string? searchName = null)
        {
            var query = _databaseContext.Products
                .Include(p => p.Sizes)
                .Include(p => p.Categories)
                .AsQueryable();

            // FILTRO DE CATEGORÍAS (ANY incluyendo subcategorías)
            if (categoryIds != null && categoryIds.Any())
            {
                var expandedCategories = categoryIds
                    .SelectMany(id => _categoryRepository.GetAllSubCategoryIds(id))
                    .Distinct()
                    .ToList();

                // Producto debe tener al menos una de las categorías o subcategorías seleccionadas
                query = query.Where(p => p.Categories.Any(c => expandedCategories.Contains(c.Id)));
            }

            // FILTRO DE TALLES (AND: debe tener todos los talles seleccionados)
            if (sizeIds != null && sizeIds.Any())
            {
                query = query.Where(p => sizeIds.All(sid => p.Sizes.Any(s => s.Talle == sid)));
            }

            // FILTROS DE PRECIO
            if (minPrice.HasValue)
                query = query.Where(p => p.Precio >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Precio <= maxPrice.Value);

            // FILTRO DE HABILITADO
            if (onlyEnabled)
                query = query.Where(p => p.Habilitado);

            // FILTRO POR NOMBRE
            if (!string.IsNullOrWhiteSpace(searchName))
                query = query.Where(p => p.Nombre.ToLower().Contains(searchName.ToLower()));

            // ORDENAMIENTO
            query = sortBy switch
            {
                "priceAsc" => query.OrderBy(p => p.Precio),
                "priceDesc" => query.OrderByDescending(p => p.Precio),
                "nameAsc" => query.OrderBy(p => p.Nombre),
                "nameDesc" => query.OrderByDescending(p => p.Nombre),
                "idAsc" => query.OrderBy(p => p.Id),
                "idDesc" => query.OrderByDescending(p => p.Id),
                "mostSold" => query.OrderByDescending(p => p.TotalVentas),
                _ => query.OrderBy(p => p.Id)
            };

            var totalCount = query.Count();

            var products = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return (products, totalCount);
        }

        public void AddProduct(Product entity)
        {
            _databaseContext.Products.Add(entity);
            _databaseContext.SaveChanges();
        }

        public void UpdateProduct(Product entity)
        {
            _databaseContext.Products.Update(entity);
            _databaseContext.SaveChanges();
        }

        public void SoftDeleteProduct(Product entity)
        {
            entity.Habilitado = !entity.Habilitado;
            _databaseContext.SaveChanges();
        }
        public void HardDeleteProduct(Product entity)
        {
            _databaseContext.Products.Remove(entity);
            _databaseContext.SaveChanges();
        }
    }
}
