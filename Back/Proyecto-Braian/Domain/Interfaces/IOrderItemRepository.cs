using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IOrderItemRepository
    {
        List<OrderItem> GetAllOrderItem();
        OrderItem? GetOrderItemById(int id);
        void AddOrderItem(OrderItem entity);
        void UpdateOrderItem(OrderItem entity);
        void SoftDeleteOrderItem(OrderItem entity);
        void HardDeleteOrderItem(OrderItem entity);
    }
}
