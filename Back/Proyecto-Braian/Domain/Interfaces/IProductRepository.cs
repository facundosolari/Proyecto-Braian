using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IProductRepository
    {
        List<Product> GetAllProducts();
        Product? GetProductById(int id);
        List<Product>? GetProductsByIds(List<int> ids);
        void AddProduct(Product entity);
        public (List<Product> Products, int TotalCount) GetProductsPaginated(
    int page, int pageSize, string? sortBy = null, List<int>? categoryIds = null,
    List<string>? sizeIds = null, decimal? minPrice = null, decimal? maxPrice = null,
    bool onlyEnabled = false, string? searchName = null);
        void UpdateProduct(Product entity);
        void SoftDeleteProduct(Product entity);
        void HardDeleteProduct(Product entity);
    }
}
