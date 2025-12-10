using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using System;
using System.Collections.Generic;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly DataBaseContext _databaseContext;

        public OrderItemRepository(DataBaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public List<OrderItem> GetAllOrderItem()
        {
            return _databaseContext.OrderItems
                .Include(oi => oi.ProductSize)
                .ThenInclude(ps => ps.Product)
                .ToList();
        }

        public OrderItem? GetOrderItemById(int id)
        {
            return _databaseContext.OrderItems
                .Include(oi => oi.ProductSize)
                .ThenInclude(ps => ps.Product)
                .FirstOrDefault(x => x.Id == id);
        }

        public void AddOrderItem(OrderItem entity)
        {
            _databaseContext.OrderItems.Add(entity);
            _databaseContext.SaveChanges();
        }

        public void UpdateOrderItem(OrderItem entity)
        {
            _databaseContext.OrderItems.Update(entity);
            _databaseContext.SaveChanges();
        }

        public void SoftDeleteOrderItem(OrderItem entity)
        {
            entity.Habilitado = false;
            _databaseContext.SaveChanges();
        }

        public void HardDeleteOrderItem(OrderItem entity)
        {
            _databaseContext.OrderItems.Remove(entity);
            _databaseContext.SaveChanges();
        }
    }
}