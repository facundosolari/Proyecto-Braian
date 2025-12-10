using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IProductSizeRepository
    {

        List<ProductSize> GetAllProductSizes();
        ProductSize? GetProductSizeById(int id);
        void AddProductSize(ProductSize entity);
        void UpdateProductSize(ProductSize entity);
        void SoftDeleteProductSize(ProductSize entity);
        void HardDeleteProductSize(ProductSize entity);

    }
}
