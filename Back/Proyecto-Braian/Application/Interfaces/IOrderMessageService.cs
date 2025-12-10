using Application.Models.Request;
using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IOrderMessageService
    {
        OrderMessageResponse? GetOrderMessageById(int id);
        List<OrderMessageResponse>? GetAllOrderMessages();
        List<OrderMessageResponse>? GetAllOrderMessagesByOrderId(int orderId);
        bool CreateMessage(OrderMessageRequest request, int senderId, string senderRole);
        bool UpdateMessage(OrderMessageRequest request, int id);

        bool MarkMessagesAsRead(int orderId, string role, int userId);

        Task<int> GetUnreadCountAsync(int orderId, int userId, string userRole);
        bool SoftDeleteMessage(int id);

    }
}
