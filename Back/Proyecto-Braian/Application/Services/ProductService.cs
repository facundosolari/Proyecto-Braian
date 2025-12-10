using Application.Interfaces;
using Application.Mappings;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _ProductRepository;
        private readonly ICategoryRepository _CategoryRepository; // ← agregado

        public ProductService(IProductRepository ProductRepository, ICategoryRepository CategoryRepository)
        {
            _ProductRepository = ProductRepository;
            _CategoryRepository = CategoryRepository; // ← agregado
        }

        public ProductResponse? GetProductById(int id)
        {
            var Product = _ProductRepository.GetProductById(id);
            if (Product != null)
            {
                return ProductDTO.ToProductResponse(Product);
            }
            return null;
        }

        public List<ProductResponse>? GetAllProducts()
        {
            var Products = _ProductRepository.GetAllProducts();
            if (Products != null)
            {
                return ProductDTO.ToProductResponse(Products);
            }
            return null;
        }



        public bool CreateProduct(ProductRequest request)
        {
            var product = ProductDTO.ToProductEntity(request);
            if (product == null)
                return false;

            // Cargar categorías
            if (request.CategoryIds != null && request.CategoryIds.Any())
            {
                var categories = _CategoryRepository.GetCategoriesByIds(request.CategoryIds).ToList();

                // Validación: ¿faltó alguna?
                if (categories.Count != request.CategoryIds.Count)
                    throw new Exception("Una o más categorías no existen.");

                product.Categories = categories;
            }

            _ProductRepository.AddProduct(product);
            return true;
        }

        public (List<ProductResponse> Products, int TotalCount) GetProductsPaged(
            int page, int pageSize, string? sortBy = null,
            List<int>? categoryIds = null, List<string>? sizeIds = null,
            decimal? minPrice = null, decimal? maxPrice = null,
            bool onlyEnabled = false, string? searchName = null)
        {
            var (products, totalCount) = _ProductRepository.GetProductsPaginated(
                page, pageSize, sortBy, categoryIds, sizeIds, minPrice, maxPrice, onlyEnabled, searchName
            );

            var response = ProductDTO.ToProductResponse(products);

            return (response, totalCount);
        }
        public bool UpdateProduct(ProductRequest request, int id)
        {
            var entity = _ProductRepository.GetProductById(id);

            if (entity == null) return false;

            // Actualizamos los campos básicos y fotos
            ProductDTO.ToProductUpdate(entity, request);

            // Manejo de categorías
            if (request.CategoryIds != null)
            {
                var newCategories = _CategoryRepository.GetCategoriesByIds(request.CategoryIds);

                entity.Categories ??= new List<Category>();

                // Quitar categorías que ya no están en el request
                var toRemove = entity.Categories.Where(c => !request.CategoryIds.Contains(c.Id)).ToList();
                foreach (var cat in toRemove)
                    entity.Categories.Remove(cat);

                // Agregar categorías nuevas que no existían
                foreach (var cat in newCategories)
                {
                    if (!entity.Categories.Any(c => c.Id == cat.Id))
                        entity.Categories.Add(cat);
                }
            }

            _ProductRepository.UpdateProduct(entity);
            return true;
        }

        public bool SoftDeleteProduct(int id)
        {
            var entity = _ProductRepository.GetProductById(id);
            if (entity != null)
            {
                if (entity.Sizes != null)
                {
                    foreach (var size in entity.Sizes)
                    {
                        size.Habilitado = !size.Habilitado;
                    }
                }
                _ProductRepository.SoftDeleteProduct(entity);
                return true;
            }
            return false;
        }

        public bool HardDeleteProduct(int id)
        {
            var entity = _ProductRepository.GetProductById(id);
            if (entity != null)
            {
                _ProductRepository.HardDeleteProduct(entity);
                return true;
            }
            return false;
        }
    }
}