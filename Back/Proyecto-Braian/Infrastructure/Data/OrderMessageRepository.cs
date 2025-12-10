using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class OrderMessageRepository : IOrderMessageRepository
    {
        private readonly DataBaseContext _dataBaseContext;

        public OrderMessageRepository(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        public List<OrderMessage> GetAllMessages()
        {
            return _dataBaseContext.OrderMessages
                .Include(om => om.Order) // Incluye el pedido al que pertenece el mensaje
                    .ThenInclude(o => o.OrderItems) // Incluye los items del pedido
                        .ThenInclude(oi => oi.ProductSize) // Incluye el talle del producto
                            .ThenInclude(ps => ps.Product) // Incluye el producto
                .ToList();
        }

        public OrderMessage? GetOrderMessageById(int id)
        {
            return _dataBaseContext.OrderMessages
                .Include(om => om.Order) // Incluye el pedido al que pertenece el mensaje
                    .ThenInclude(o => o.OrderItems) // Incluye los items del pedido
                        .ThenInclude(oi => oi.ProductSize) // Incluye el talle del producto
                            .ThenInclude(ps => ps.Product) // Incluye el producto
                .FirstOrDefault(i => i.Id == id);
        }

        public List<OrderMessage> GetOrderMessagesByOrderId(int orderId)
        {
            return _dataBaseContext.OrderMessages
                .Where(om => om.OrderId == orderId) // filtramos por OrderId
                .Include(om => om.Order) // opcional, si necesitás info de la orden
                    .ThenInclude(o => o.OrderItems) // opcional
                        .ThenInclude(oi => oi.ProductSize)
                            .ThenInclude(ps => ps.Product)
                .ToList();
        }

        public bool SaveChanges()
        {
            return _dataBaseContext.SaveChanges() > 0;
        }

        public async Task<int> GetUnreadCountAsync(int orderId, int userId, string userRole)
        {
            if (userRole != "Admin" && userRole != "User")
                throw new ArgumentException("Rol inválido");

            var query = _dataBaseContext.OrderMessages
                .Where(m => m.OrderId == orderId && m.Habilitado);

            if (userRole == "Admin")
            {
                query = query.Where(m => m.LeidoPorAdmin == false);
            }
            else // User
            {
                query = query.Where(m => m.LeidoPorUser == false && m.SenderId != userId);
            }

            return await query.CountAsync();
        }
        public void AddMessage(OrderMessage message)
        {
            _dataBaseContext.OrderMessages.Add(message);
            _dataBaseContext.SaveChanges();
        }

        public void UpdateMessage(OrderMessage message)
        {
            _dataBaseContext.OrderMessages.Update(message);
            _dataBaseContext.SaveChanges();
        }

        public void SoftDeleteMessage(OrderMessage message)
        {
            message.Habilitado = !message.Habilitado;
            _dataBaseContext.SaveChanges();
        }

        public void HardDeleteMessage(OrderMessage message)
        {
            _dataBaseContext.OrderMessages.Remove(message);
            _dataBaseContext.SaveChanges();
        }
    }
}
