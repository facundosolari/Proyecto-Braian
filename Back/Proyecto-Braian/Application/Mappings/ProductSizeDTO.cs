using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;

namespace Application.Mappings
{
    public static class ProductSizeDTO
    {
        public static ProductSize ToProductSizeEntity (ProductSizeRequest request)
        {
            return new ProductSize()
            {
                ProductId = request.ProductId,
                Talle = request.Talle,
                Stock = request.Stock,
            };
        }

        public static ProductSizeResponse ToProductSizeResponse (ProductSize productSize)
        {
            return new ProductSizeResponse
            {
                Id = productSize.Id,
                ProductId = productSize.ProductId,
                Talle = productSize.Talle,
                Stock = productSize.Stock,
                Habilitado = productSize.Habilitado,
            };
        }

        public static List<ProductSizeResponse>? ToProductSizeResponse (List<ProductSize> products)
        {
            return products.Select(x =>  new ProductSizeResponse
            {
                Id = x.Id,
                ProductId = x.ProductId,
                Talle = x.Talle,
                Stock = x.Stock,
                Habilitado = x.Habilitado,
            }).ToList();
        }

        public static void ToProductSizeUpdate (ProductSizeRequest productSizeRequest, ProductSize productSize)
        {
            productSize.Talle = productSizeRequest.Talle;
            productSize.Stock = productSizeRequest.Stock;
        }
    }
}
