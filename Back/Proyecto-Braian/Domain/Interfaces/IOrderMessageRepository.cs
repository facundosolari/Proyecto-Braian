using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IOrderMessageRepository
    {
        List<OrderMessage> GetAllMessages();
        OrderMessage? GetOrderMessageById(int id);
        List<OrderMessage> GetOrderMessagesByOrderId(int orderId);
        bool SaveChanges();
        Task<int> GetUnreadCountAsync(int orderId, int userId, string userRole);
        void AddMessage(OrderMessage message);
        void UpdateMessage(OrderMessage message);
        void SoftDeleteMessage(OrderMessage message);
        void HardDeleteMessage(OrderMessage message);
    }
}
