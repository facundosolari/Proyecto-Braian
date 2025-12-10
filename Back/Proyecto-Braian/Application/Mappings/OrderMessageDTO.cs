using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Mappings
{
    public static class OrderMessageDTO
    {
        // Ahora recibe senderId y senderRole al crear el mensaje
        public static OrderMessage ToOrderMessageEntity(OrderMessageRequest request, int senderId, string senderRole)
        {
            return new OrderMessage
            {
                OrderId = request.OrderId,
                Message = request.Message,
                SenderId = senderId,
                SenderRole = senderRole,
                Habilitado = true,
                LeidoPorAdmin = senderRole == "Admin", // si lo envía Admin, marcado como leído para él
                LeidoPorUser = senderRole == "User",   // si lo envía User, marcado como leído para él
                FechaHoraMessage = DateTime.Now
            };
        }

        public static OrderMessageResponse ToOrderMessageResponse(OrderMessage entity)
        {
            return new OrderMessageResponse
            {
                Id = entity.Id,
                OrderId = entity.OrderId,
                Message = entity.Message,
                FechaHoraMessage = entity.FechaHoraMessage,
                Habilitado = entity.Habilitado,
                SenderId = entity.SenderId,
                SenderRole = entity.SenderRole,
                LeidoPorAdmin = entity.LeidoPorAdmin,
                LeidoPorUser = entity.LeidoPorUser
            };
        }

        public static List<OrderMessageResponse> ToOrderMessageResponseList(List<OrderMessage> entities)
        {
            return entities.Select(ToOrderMessageResponse).ToList();
        }

        public static void ToUpdateOrderMessage(OrderMessage entity, OrderMessageRequest request)
        {
            entity.Message = request.Message;
        }
    }
}