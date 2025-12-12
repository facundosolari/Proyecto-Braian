using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IOrderService
    {
        OrderResponse? GetOrderById(int orderId, int? userId = null, bool esAdmin = false);
        List<OrderResponse>? GetOrdersByUserId(int userId);
        List<OrderResponse>? GetAllOrders();
        (List<OrderResponse> Orders, int TotalCount) GetOrdersByUserIdPaginated(
            int userId,
            int page,
            int pageSize,
            bool? tieneMensajesNoLeidos = null,
            int? estado = null,          // 🔥 sigue siendo int? para el servicio
            bool esAdmin = false,
            DateTime? fechaDesde = null,
            DateTime? fechaHasta = null,
            string sortBy = "FechaHora",
            string sortOrder = "desc");

        (List<OrderResponse> Orders, int TotalCount) GetOrdersByEstadoPaginated(
            EstadoPedido estadoPedido,
            int page,
            int pageSize,
            DateTime? fechaDesde = null,
            DateTime? fechaHasta = null,
            bool? tieneMensajesNoLeidos = null,
            bool esAdmin = false,
            string sortBy = "FechaHora",
            string sortOrder = "desc");
        //(List<OrderResponse> Orders, int TotalCount) GetOrdersByEstadoPaginated(EstadoPedido estadoPedido, int page, int pageSize);
        bool CreateOrder(OrderRequest request, int tokenUserId);
        // bool UpdateOrder(OrderRequest request, int id, int tokenUserId);
        bool UpdateOrderDetalleFacturacion(int orderId, DetalleFacturacionRequest request, int tokenUserId, string userRol);
        bool CancelOrder(int id, int userId, string rolClaim);
        bool ConfirmOrder(int id);

       // Order? ConfirmOrder(int id);
        bool PagoOrder(int id);
        bool FinalizeOrder(int id);
        /*
        bool SoftDeleteOrder(int id);
        bool HardDeleteOrder(int id);
        */
    }
}
