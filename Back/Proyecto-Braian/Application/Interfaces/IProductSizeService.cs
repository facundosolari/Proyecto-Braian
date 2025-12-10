using Application.Models.Request;
using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IProductSizeService
    {
        ProductSizeResponse? GetProductSizeById(int id);
        List<ProductSizeResponse>? GetAllProductSizes();
        bool CreateProductSize(ProductSizeRequest request);
        bool UpdateProductSize(ProductSizeRequest request, int id);
        
        bool SoftDeleteProductSize(int id);
        /*
        bool HardDeleteProductSize(int id);
        */
    }
}
