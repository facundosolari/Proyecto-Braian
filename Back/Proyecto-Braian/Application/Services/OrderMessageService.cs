using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Application.Mappings;
using Application.Models.Response;
using Application.Models.Request;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class OrderMessageService : IOrderMessageService
    {
        private readonly IOrderMessageRepository _orderMessageRepository;
        private readonly IOrderRepository _orderRepository;
        public OrderMessageService (IOrderMessageRepository orderMessageRepository, IOrderRepository orderRepository)
        {
            _orderMessageRepository = orderMessageRepository;
            _orderRepository = orderRepository;
        }

        public OrderMessageResponse? GetOrderMessageById (int id)
        {
            var orderMessage = _orderMessageRepository.GetOrderMessageById (id);
            if (orderMessage == null) return null;
            return OrderMessageDTO.ToOrderMessageResponse(orderMessage);
        }

        public List<OrderMessageResponse>? GetAllOrderMessages ()
        {
            var orderMessages = _orderMessageRepository.GetAllMessages();
            if (orderMessages == null) return null;
            return OrderMessageDTO.ToOrderMessageResponseList(orderMessages);
        }

        public List<OrderMessageResponse>? GetAllOrderMessagesByOrderId(int orderId)
        {
            var orderMessages = _orderMessageRepository.GetOrderMessagesByOrderId(orderId);
            if (orderMessages == null || orderMessages.Count == 0)
                return null; //new List<OrderMessageResponse>();
            return OrderMessageDTO.ToOrderMessageResponseList(orderMessages);
        }

        public bool CreateMessage(OrderMessageRequest request, int senderId, string senderRole)
        {
            var order = _orderRepository.GetOrderById(request.OrderId);
            if (order == null) return false;

            var entity = OrderMessageDTO.ToOrderMessageEntity(request, senderId, senderRole);
            if (entity == null) return false;

            _orderMessageRepository.AddMessage(entity);
            return true;
        }

        public bool UpdateMessage(OrderMessageRequest request, int id)
        {
            var message = _orderMessageRepository.GetOrderMessageById(id);
            if (message == null) return false;
            var order = _orderRepository.GetOrderById(request.OrderId);
            if (order == null) return false;
            bool pertenece = order.Messages.Any(m => m.Id == message.Id);
            if (pertenece == false) return false;
            OrderMessageDTO.ToUpdateOrderMessage(message, request);
            _orderMessageRepository.UpdateMessage(message);
            return true;
        }

        public bool MarkMessagesAsRead(int orderId, string role, int userId)
        {
            // 1. Traer la orden (idealmente incluir UserId)
            var order = _orderRepository.GetOrderById(orderId);

            if (order == null)
                return false;

            // 2. Si es USUARIO, validar que la orden le pertenece
            if (role == "User" && order.UserId != userId)
                return false;

            // 3. Obtener mensajes
            var messages = _orderMessageRepository.GetOrderMessagesByOrderId(orderId);

            if (messages == null || messages.Count == 0)
                return false;

            bool changes = false;

            foreach (var msg in messages)
            {
                // Usuario marca solo los mensajes enviados por el admin
                if (role == "User" && msg.SenderRole == "Admin" && !msg.LeidoPorUser)
                {
                    msg.LeidoPorUser = true;
                    changes = true;
                }

                // Admin marca solo los mensajes enviados por el usuario
                if (role == "Admin" && msg.SenderRole == "User" && !msg.LeidoPorAdmin)
                {
                    msg.LeidoPorAdmin = true;
                    changes = true;
                }
            }

            if (changes)
                return _orderMessageRepository.SaveChanges();

            return true;
        }

        public async Task<int> GetUnreadCountAsync(int orderId, int userId, string userRole)
        {
            return await _orderMessageRepository.GetUnreadCountAsync(orderId, userId, userRole);
        }

        public bool SoftDeleteMessage(int id)
        {
            var message = _orderMessageRepository.GetOrderMessageById(id);
            if (message == null) return false;
            _orderMessageRepository.SoftDeleteMessage(message);
            return true;
        }

        public bool HardDeleteMessage(int id)
        {
            var message = _orderMessageRepository.GetOrderMessageById(id);
            if (message == null) return false;
            _orderMessageRepository.HardDeleteMessage(message);
            return true;
        }
    }
}
