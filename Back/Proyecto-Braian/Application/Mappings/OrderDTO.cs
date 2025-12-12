using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;

namespace Application.Mappings
{
    public static class OrderDTO
    {
        public static Order ToOrderEntity(OrderRequest request)
        {
            return new Order()
            {
                OrderItems = new List<OrderItem>(),
                DetalleFacturacion = DetalleFacturacionDTO.ToDetalleFacturacionEntity(request.DetalleFacturacion),
            };
        }

        public static OrderResponse? ToOrderResponse(Order order)
        {
            if (order == null) return null;

            return new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                // 🔥 Aquí usamos el DTO de OrderItem para mapear los productos
                OrderItems = order.OrderItems?.Select(OrderItemDTO.ToOrderItemResponse).ToList(),
                FechaHora = order.FechaHora,
                Confirmada = order.Confirmada,
                Pagada = order.Pagada,
                Total = order.Total,
                EstadoPedido = order.EstadoPedido,
                Habilitado = order.Habilitado,
                Detalle_Facturacion = DetalleFacturacionDTO.ToDetalleFacturacionResponse(order.DetalleFacturacion),
            };
        }

        public static List<OrderResponse?> ToOrderResponse(List<Order> orders)
        {
            return orders.Select(ToOrderResponse).ToList();
        }

        public static void ToOrderUpdate(Order order, OrderRequest request)
        {
            order.DetalleFacturacion = DetalleFacturacionDTO.ToDetalleFacturacionEntity(request.DetalleFacturacion);
        }

        public static void ToOrderUpdate(Order order, OrderPatchRequest request)
        {
         //   order.Dirección_Envio = request.Dirección_Envio;
        }
    }
}

