using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappings
{
    public static class CategoryDTO
    {
        public static Category ToCategoryEntity(CategoryRequest request)
        {
            return new Category()
            {
                Nombre = request.Nombre,
                Productos = new List<Product>(),
                ParentCategoryId = request.ParentCategoryId,
            };
        }

        public static CategoryResponse? ToCategoryResponse(Category category)
        {
            if (category == null) return null;

            return new CategoryResponse
            {
                Id = category.Id,
                Nombre = category.Nombre,
                Habilitado = category.Habilitado,
                Productos = category.Productos?.Select(p => new ProductResponse
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Precio = p.Precio,
                    Habilitado = p.Habilitado,
                    Fotos = p.Fotos,
                    // Mapear talles usando ProductSizeResponse
                    Sizes = p.Sizes?.Select(s => new ProductSizeResponse
                    {
                        Id = s.Id,
                        ProductId = p.Id,
                        Talle = s.Talle,        // <-- nombre del talle
                        Stock = s.Stock,       // si tu entidad Size tiene Stock
                        Habilitado = s.Habilitado
                    }).ToList(),
                    // Mapear categorías del producto
                    Categories = p.Categories?.Select(c => new CategoryResponse
                    {
                        Id = c.Id,
                        Nombre = c.Nombre
                    }).ToList()
                }).ToList(),

                // Mapear subcategorías recursivamente
                SubCategories = category.SubCategories?.Select(ToCategoryResponse).ToList(),
                ParentCategoryResponse = category.ParentCategoryId,
            };
        }

        public static List<CategoryResponse?> ToCategoryResponse(List<Category> categories)
        {
            return categories.Select(ToCategoryResponse).ToList();
        }

        public static void ToCategoryUpdate(Category category, CategoryRequest request)
        {
            category.Nombre = request.Nombre;
            category.ParentCategoryId = request.ParentCategoryId;
        }

    }
}
