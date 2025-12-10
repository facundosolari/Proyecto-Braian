using Application.Models.Request;
using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Mappings
{
    public static class ProductDTO
    {
        public static Product ToProductEntity (ProductRequest request)
        {
            return new Product()
            {
                Nombre = request.Nombre,
                Descripcion = request.Descripcion,
                Precio = request.Precio,
                Sizes = new List<ProductSize>(),
                Fotos = request.Fotos ?? new List<string>(),
            };
        }

        public static ProductResponse? ToProductResponse(Product product)
        {
            return new ProductResponse
            {
                Id = product.Id,
                Nombre = product.Nombre,
                Descripcion = product.Descripcion,
                Precio = product.Precio,
                Habilitado = product.Habilitado,
                Sizes = product?.Sizes?.Select(s => new ProductSizeResponse
                {
                    Id = s.Id,
                    Talle = s.Talle,
                    Stock = s.Stock,
                    Habilitado = s.Habilitado,
                }).ToList(),
                Fotos = product?.Fotos,
                Categories = product?.Categories?.Select(c => new CategoryResponse
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                }).ToList(),
                TotalVentas = product.TotalVentas,
            };
        }

        public static List<ProductResponse>? ToProductResponse(List<Product> products)
        {
            return products?.Select(p => new ProductResponse
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                Precio = p.Precio,
                Habilitado = p.Habilitado,
                Sizes = p?.Sizes?.Select(s => new ProductSizeResponse
                {
                    Id = s.Id,
                    Talle = s.Talle,
                    Stock = s.Stock,
                    Habilitado = s.Habilitado,
                }).ToList(),
                Fotos = p?.Fotos,
                Categories = p?.Categories?.Select(c => new CategoryResponse
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                }).ToList(),
                TotalVentas = p.TotalVentas,

            }).ToList();
        }
        public static void ToProductUpdate (Product product, ProductRequest request)
        {
            product.Nombre = request.Nombre;
            product.Descripcion = request.Descripcion;
            product.Precio = request.Precio;
            product.Fotos = request.Fotos;

        }
    }
}
