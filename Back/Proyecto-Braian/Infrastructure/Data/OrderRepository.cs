using Domain.Entities;
using Domain.Enum;
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
    public class OrderRepository : IOrderRepository
    {
        private readonly DataBaseContext _databaseContext;

        public OrderRepository(DataBaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public List<Order> GetAllOrder()
        {
            return _databaseContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSize)
                        .ThenInclude(ps => ps.Product)
                        //  .ThenInclude(p => p.Fotos)
                .ToList();
        }

        public Order? GetOrderById(int id)
        {
            return _databaseContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSize)
                        .ThenInclude(ps => ps.Product)
                         //   .ThenInclude(p => p.Fotos)
                .FirstOrDefault(x => x.Id == id);
        }

        public List<Order>? GetOrdersByUserId(int userId)
        {
            return _databaseContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSize)
                        .ThenInclude(ps => ps.Product)
                     //       .ThenInclude(p => p.Fotos)
                .Where(o => o.UserId == userId)
                .ToList();
        }

        public (List<Order> Orders, int TotalCount) GetOrdersByUserIdPaginated(
    int userId,
    int page,
    int pageSize,
    bool? tieneMensajesNoLeidos = null // 👈 AGREGO ESTO
)
        {
            var query = _databaseContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSize)
                        .ThenInclude(ps => ps.Product)
                .Include(o => o.Messages)
                .Where(o => o.UserId == userId);

            // 🔥 FILTRO POR MENSAJES DEL USER 🔥
            if (tieneMensajesNoLeidos == true)
            {
                // SOLO órdenes con mensajes NO leídos
                query = query.Where(o =>
                    o.Messages.Any(m => m.Habilitado && !m.LeidoPorUser)
                );
            }
            else if (tieneMensajesNoLeidos == false)
            {
                // SOLO órdenes donde NO existen mensajes no leídos
                query = query.Where(o =>
                    !o.Messages.Any(m => m.Habilitado && !m.LeidoPorUser)
                );
            }

            query = query.OrderByDescending(o => o.FechaHora);

            var totalCount = query.Count();

            var orders = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return (orders, totalCount);
        }
        public (List<Order> Orders, int TotalCount) GetOrdersByEstadoPaginated(
            EstadoPedido estadoPedido,
            int page,
            int pageSize,
            DateTime? fechaDesde = null,
            DateTime? fechaHasta = null,
            bool? tieneMensajesNoLeidos = null,
            bool esAdmin = false,
            string sortBy = "FechaHora",
            string sortOrder = "desc")
        {
            var query = _databaseContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSize)
                        .ThenInclude(ps => ps.Product)
                .Include(o => o.Messages)
                .Where(o => o.EstadoPedido == estadoPedido);

            if (fechaDesde.HasValue)
                query = query.Where(o => o.FechaHora >= fechaDesde.Value);

            if (fechaHasta.HasValue)
                query = query.Where(o => o.FechaHora <= fechaHasta.Value);

            // 🔥 FILTRO POR MENSAJES NO LEÍDOS SEGÚN ROL 🔥
            // 🔥 FILTRO SOLO PARA ADMIN 🔥
            if (tieneMensajesNoLeidos == true)
            {
                // Órdenes con al menos un mensaje habilitado NO leído por admin
                query = query.Where(o =>
                    o.Messages.Any(m => m.Habilitado && !m.LeidoPorAdmin)
                );
            }
            else if (tieneMensajesNoLeidos == false)
            {
                // Órdenes donde NO existen mensajes habilitados sin leer por admin
                query = query.Where(o =>
                    !o.Messages.Any(m => m.Habilitado && !m.LeidoPorAdmin)
                );
            }

            // Ordenamiento dinámico
            query = (sortBy, sortOrder.ToLower()) switch
            {
                ("Id", "asc") => query.OrderBy(o => o.Id),
                ("Id", "desc") => query.OrderByDescending(o => o.Id),
                ("FechaHora", "asc") => query.OrderBy(o => o.FechaHora),
                ("FechaHora", "desc") => query.OrderByDescending(o => o.FechaHora),
                _ => query.OrderByDescending(o => o.FechaHora)
            };

            var totalCount = query.Count();

            var orders = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return (orders, totalCount);
        }


        /*
        public (List<Order> Orders, int TotalCount) GetOrdersByEstadoPaginated(EstadoPedido estadoPedido, int page, int pageSize)
        {
            var query = _databaseContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSize)
                        .ThenInclude(ps => ps.Product)
                .Where(o => o.EstadoPedido == estadoPedido)
                .OrderByDescending(o => o.FechaHora);

            var totalCount = query.Count();

            var orders = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return (orders, totalCount);
        }
        */

        public void AddOrder(Order entity)
        {
            _databaseContext.Orders.Add(entity);
            _databaseContext.SaveChanges();
        }

        public void UpdateOrder(Order entity)
        {
            _databaseContext.Orders.Update(entity);
            _databaseContext.SaveChanges();
        }

        public void SoftDeleteOrder(Order entity)
        {
            entity.Habilitado = false;
            _databaseContext.SaveChanges();
        }

        public void HardDeleteOrder(Order entity)
        {
            _databaseContext.Orders.Remove(entity);
            _databaseContext.SaveChanges();
        }
    }
}
