using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;

namespace Application.Mappings
{
    public static class OrderItemDTO
    {
        public static OrderItem ToOrderItemEntity(OrderItemRequest request)
        {
            return new OrderItem()
            {
                OrderId = request.OrderId,
                ProductSizeId = request.ProductSizeId,
                Cantidad = request.Cantidad,
            };
        }

        public static OrderItemResponse ToOrderItemResponse(OrderItem orderItem)
        {
            return new OrderItemResponse
            {
                Id = orderItem.Id,
                ProductSizeId = orderItem.ProductSizeId,
                OrderId = orderItem.OrderId,
                Cantidad = orderItem.Cantidad,
                Habilitado = orderItem.Habilitado,

                // 🔥 Accede gracias al Include
                ProductId = orderItem.ProductSize.Product.Id,
                Talle = orderItem.ProductSize.Talle,
                NombreProducto = orderItem.ProductSize.Product.Nombre,
                Precio = orderItem.ProductSize.Product.Precio,
                Fotos = orderItem.ProductSize.Product.Fotos
            };
        }

        public static List<OrderItemResponse> ToOrderItemResponse(List<OrderItem> orderItems)
        {
            return orderItems.Select(x => new OrderItemResponse
            {
                Id = x.Id,
                ProductSizeId = x.ProductSizeId,
                OrderId = x.OrderId,
                Cantidad = x.Cantidad,
                Habilitado = x.Habilitado,

                ProductId = x.ProductSize.Product.Id,
                Talle = x.ProductSize.Talle,
                NombreProducto = x.ProductSize.Product.Nombre,
                Precio = x.ProductSize.Product.Precio,
                Fotos = x.ProductSize.Product.Fotos
            }).ToList();
        }

        public static void ToUpdateOrderItemAdmin(OrderItem orderItem, OrderItemRequest request)
        {
            orderItem.ProductSizeId = request.ProductSizeId;
            orderItem.Cantidad = request.Cantidad;
        }

        public static void ToUpdateOrderItem(OrderItem orderItem, OrderItemPatchRequest request)
        {
            orderItem.Cantidad = request.Cantidad;
        }
    }
}