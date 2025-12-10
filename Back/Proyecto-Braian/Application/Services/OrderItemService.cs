using Application.Interfaces;
using Application.Mappings;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class OrderItemService : IOrderItemService
    {

        private readonly IOrderItemRepository _OrderItemRepository;
        private readonly IOrderRepository _OrderRepository;
        private readonly IProductSizeRepository _ProductSizeRepository;

        public OrderItemService(IOrderItemRepository OrderItemRepository, IOrderRepository orderRepository, IProductSizeRepository productSizeRepository)
        {
            _OrderItemRepository = OrderItemRepository;
            _OrderRepository = orderRepository;
            _ProductSizeRepository = productSizeRepository;
        }

        public OrderItemResponse? GetOrderItemById(int id)
        {
            var OrderItem = _OrderItemRepository.GetOrderItemById(id);
            if (OrderItem != null)
            {
                return OrderItemDTO.ToOrderItemResponse(OrderItem);
            }
            return null;

        }
        public List<OrderItemResponse>? GetAllOrderItems()
        {
            var OrderItems = _OrderItemRepository.GetAllOrderItem();
            if (OrderItems != null)
            {
                return OrderItemDTO.ToOrderItemResponse(OrderItems);
            }
            return null;
        }

        public bool CreateOrderItem(OrderItemRequest request, int tokenUserId)
        {
            var order = _OrderRepository.GetOrderById(request.OrderId);
            if (order == null) return false;
            if (order.UserId != tokenUserId) return false;
            var productSize = _ProductSizeRepository.GetProductSizeById(request.ProductSizeId);
            if (productSize == null) return false;
            if (request.Cantidad <= 0) return false;
            if (productSize.Stock < request.Cantidad) return false;
            var OrderItem = OrderItemDTO.ToOrderItemEntity(request);
            if (OrderItem != null)
            {
                _OrderItemRepository.AddOrderItem(OrderItem);
                return true;
            }
            return false;
        }

        public void CreateOrderItem(OrderItem orderItem, int tokenUserId)
        {
            var order = _OrderRepository.GetOrderById(orderItem.OrderId);
            if (order == null) throw new Exception("Orden no existe");
            if (order.UserId != tokenUserId) throw new Exception("Usuario no autorizado");

            _OrderItemRepository.AddOrderItem(orderItem);
        }

        public bool UpdateOrderItemAdmin(OrderItemRequest request, int id)
        {
            var order = _OrderRepository.GetOrderById(request.OrderId);
            if (order == null) return false;
            var productSize = _ProductSizeRepository.GetProductSizeById(request.ProductSizeId);
            if (productSize == null) return false;
            if (request.Cantidad > productSize.Stock) return false;
            if (order.Confirmada || order.Habilitado == false)
                return false;
            if (request.Cantidad <= 0) return false;
            if (productSize.Stock < request.Cantidad) return false;
            var entity = _OrderItemRepository.GetOrderItemById(id);
            if (entity == null) return false;
            OrderItemDTO.ToUpdateOrderItemAdmin(entity, request);
            _OrderItemRepository.UpdateOrderItem(entity);
            return true;
        }

        /* public bool UpdateOrderItem(OrderItemPatchRequest request, int id, int tokenUserId)
         {
             var entity = _OrderItemRepository.GetOrderItemById(id);
             if (entity == null) return false;
             var order = _OrderRepository.GetOrderById(entity.OrderId);
             if (order == null) return false;
             if (order.UserId != tokenUserId) return false;
             if (order.Confirmada || order.Habilitado == false)
                 return false;
             if (request.Cantidad < 0) return false;
             var productSize = _ProductSizeRepository.GetProductSizeById(entity.ProductSizeId);
             if (productSize == null) return false;
             if (request.Cantidad > productSize.Stock) return false;
             if (request.Cantidad == 0 && entity.Habilitado)
             {
                 _OrderItemRepository.HardDeleteOrderItem(entity);
                 return true;
             }
             OrderItemDTO.ToUpdateOrderItem(entity, request);
             _OrderItemRepository.UpdateOrderItem(entity);
             return true;
         }*/

        public bool UpdateOrderItem(OrderItemPatchRequest request, int id, int tokenUserId)
        {
            var entity = _OrderItemRepository.GetOrderItemById(id);
            if (entity == null) return false;

            var order = _OrderRepository.GetOrderById(entity.OrderId);
            if (order == null) return false;

            if (order.UserId != tokenUserId) return false; // solo el dueño puede modificar
            if (order.Confirmada || order.Habilitado == false) return false; // no modificar orden confirmada

            if (request.Cantidad < 0) return false;

            var productSize = _ProductSizeRepository.GetProductSizeById(entity.ProductSizeId);
            if (productSize == null) return false;

            // Considerar stock disponible sumando la cantidad que ya estaba reservada
            int stockDisponible = productSize.Stock + entity.Cantidad;
            if (request.Cantidad > stockDisponible) return false;

            if (request.Cantidad == 0)
            {
                // Si la cantidad es 0, eliminamos el item
                _OrderItemRepository.HardDeleteOrderItem(entity);
            }
            else
            {
                // Actualizamos cantidad
                OrderItemDTO.ToUpdateOrderItem(entity, request);
                _OrderItemRepository.UpdateOrderItem(entity);
            }

            // Recalcular total de la orden
            order.Total = order.OrderItems
                .Where(x => x.Habilitado)
                .Sum(x => x.Cantidad * x.ProductSize.Product.Precio);

            _OrderRepository.UpdateOrder(order);

            return true;
        }

        public bool SoftDeleteOrderItem(int id)
        {
            var entity = _OrderItemRepository.GetOrderItemById(id);
            if (entity != null)
            {
                _OrderItemRepository.SoftDeleteOrderItem(entity);
                return true;
            }
            return false;
        }
        public bool HardDeleteOrderItem(int id)
        {
            var entity = _OrderItemRepository.GetOrderItemById(id);
            if (entity != null)
            {
                _OrderItemRepository.HardDeleteOrderItem(entity);
                return true;
            }
            return false;
        }

    }
}