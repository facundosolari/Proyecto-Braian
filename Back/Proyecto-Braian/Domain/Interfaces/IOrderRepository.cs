using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IOrderRepository
    {
        List<Order> GetAllOrder();
        Order? GetOrderById(int id);

        List<Order>? GetOrdersByUserId(int userId);
        (List<Order> Orders, int TotalCount) GetOrdersByUserIdPaginated(int userId, int page, int pageSize);
        (List<Order> Orders, int TotalCount) GetOrdersByEstadoPaginated(
    EstadoPedido estadoPedido,
    int page,
    int pageSize,
    DateTime? fechaDesde = null,
    DateTime? fechaHasta = null,
    string sortBy = "FechaHora",
    string sortOrder = "desc");
       // (List<Order> Orders, int TotalCount) GetOrdersByEstadoPaginated(EstadoPedido estadoPedido, int page, int pageSize);
        void AddOrder(Order entity);
        void UpdateOrder(Order entity);
        void SoftDeleteOrder(Order entity);
        void HardDeleteOrder(Order entity);

    }
}
