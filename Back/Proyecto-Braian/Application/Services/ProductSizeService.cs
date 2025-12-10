using Application.Interfaces;
using Application.Mappings;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ProductSizeService : IProductSizeService
    {

        private readonly IProductSizeRepository _ProductSizeRepository;
        private readonly IProductRepository _ProductRepository;

        public ProductSizeService(IProductSizeRepository ProductSizeRepository , IProductRepository productRepository)
        {
            _ProductSizeRepository = ProductSizeRepository;
            _ProductRepository = productRepository;
        }

        public ProductSizeResponse? GetProductSizeById(int id)
        {
            var ProductSize = _ProductSizeRepository.GetProductSizeById(id);
            if (ProductSize != null)
            {
                return ProductSizeDTO.ToProductSizeResponse(ProductSize);
            }
            return null;

        }
        public List<ProductSizeResponse>? GetAllProductSizes()
        {
            var ProductSizes = _ProductSizeRepository.GetAllProductSizes();
            if (ProductSizes != null)
            {
                return ProductSizeDTO.ToProductSizeResponse(ProductSizes);
            }
            return null;
        }

        public bool CreateProductSize(ProductSizeRequest request)
        {
            var product = _ProductRepository.GetProductById(request.ProductId);
            if (product == null) return false;
            if (request.Stock < 1) return false;
            var ProductSize = ProductSizeDTO.ToProductSizeEntity(request);
            if (ProductSize != null)
            {
                _ProductSizeRepository.AddProductSize(ProductSize);
                return true;
            }
            return false;
        }

        public bool UpdateProductSize(ProductSizeRequest request, int id)
        {
            var entity = _ProductSizeRepository.GetProductSizeById(id);
            var product = _ProductRepository.GetProductById(request.ProductId);
            if (product == null) return false;
            if (request.Stock < 1) return false;
            if (entity != null)
            {
                ProductSizeDTO.ToProductSizeUpdate(request, entity);
                _ProductSizeRepository.UpdateProductSize(entity);
                return true;
            }
            return false;
        }

        public bool SoftDeleteProductSize(int id)
        {
            var entity = _ProductSizeRepository.GetProductSizeById(id);
            if (entity != null)
            {
                _ProductSizeRepository.SoftDeleteProductSize(entity);
                return true;
            }
            return false;
        }
        public bool HardDeleteProductSize(int id)
        {
            var entity = _ProductSizeRepository.GetProductSizeById(id);
            if (entity != null)
            {
                _ProductSizeRepository.HardDeleteProductSize(entity);
                return true;
            }
            return false;
        }

    }
}
