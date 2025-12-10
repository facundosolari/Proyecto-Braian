using Domain.Entities;
using Infrastructure.Context;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductSizeRepository : IProductSizeRepository
    {

        private readonly DataBaseContext _databaseContext;

        public ProductSizeRepository(DataBaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public List<ProductSize> GetAllProductSizes()
        {
            return _databaseContext.ProductSizes
                .Include(ps => ps.Product)
                .ToList();
        }
        public ProductSize? GetProductSizeById(int id)
        {
            return _databaseContext.ProductSizes
                .Include(ps => ps.Product)
                .FirstOrDefault(x => x.Id.Equals(id));
        }

        public void AddProductSize(ProductSize entity)
        {
            _databaseContext.ProductSizes.Add(entity);
            _databaseContext.SaveChanges();
        }

        public void UpdateProductSize(ProductSize entity)
        {
            _databaseContext.ProductSizes.Update(entity);
            _databaseContext.SaveChanges();
        }

        public void SoftDeleteProductSize(ProductSize entity)
        {
            entity.Habilitado = !entity.Habilitado;
            _databaseContext.SaveChanges();
        }
        public void HardDeleteProductSize(ProductSize entity)
        {
            _databaseContext.ProductSizes.Remove(entity);
            _databaseContext.SaveChanges();
        }
    }
}
