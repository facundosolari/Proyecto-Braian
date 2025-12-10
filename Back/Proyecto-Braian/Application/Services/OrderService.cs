using Application.Interfaces;
using Application.Mappings;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Interfaces;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Services
{
    public class OrderService : IOrderService
    {

        private readonly IOrderRepository _OrderRepository;
        private readonly IOrderItemService _OrderItemService;
        private readonly IProductSizeRepository _ProductSizeRepository;
        private readonly IUserRepository _UserRepository;
        private readonly IAuditLogRepository _AuditLogRepository;

        public OrderService(IOrderRepository OrderRepository, IUserRepository userRepository, IOrderItemService orderItemService,
            IProductSizeRepository productSizeRepository, IAuditLogRepository auditLogRepository)
        {
            _OrderRepository = OrderRepository;
            _UserRepository = userRepository;
            _OrderItemService = orderItemService;
            _ProductSizeRepository = productSizeRepository;
            _AuditLogRepository = auditLogRepository;
        }

        public OrderResponse? GetOrderById(int id)
        {
            var Order = _OrderRepository.GetOrderById(id);
            if (Order != null)
            {
                return OrderDTO.ToOrderResponse(Order);
            }
            return null;

        }

        public List<OrderResponse>? GetOrdersByUserId(int userId)
        {
            var Orders = _OrderRepository.GetOrdersByUserId(userId);
            if (Orders != null)
            {
                return OrderDTO.ToOrderResponse(Orders);
            }
            return null;

        }
        public List<OrderResponse>? GetAllOrders()
        {
            var Orders = _OrderRepository.GetAllOrder();
            if (Orders != null)
            {
                return OrderDTO.ToOrderResponse(Orders);
            }
            return null;
        }

        public (List<OrderResponse> Orders, int TotalCount) GetOrdersByUserIdPaginated(int userId, int page, int pageSize)
        {
            var (orders, totalCount) = _OrderRepository.GetOrdersByUserIdPaginated(userId, page, pageSize);
            var response = OrderDTO.ToOrderResponse(orders);
            return (response, totalCount);
        }
        /*
        public (List<OrderResponse> Orders, int TotalCount) GetOrdersByEstadoPaginated(EstadoPedido estadoPedido, int page, int pageSize)
        {
            var (orders, totalCount) = _OrderRepository.GetOrdersByEstadoPaginated(estadoPedido, page, pageSize);
            var response = OrderDTO.ToOrderResponse(orders);
            return (response, totalCount);
        }
        */

        public (List<OrderResponse> Orders, int TotalCount) GetOrdersByEstadoPaginated(
    EstadoPedido estadoPedido,
    int page,
    int pageSize,
    DateTime? fechaDesde = null,
    DateTime? fechaHasta = null,
    string sortBy = "FechaHora",
    string sortOrder = "desc")
        {
            var (orders, totalCount) = _OrderRepository.GetOrdersByEstadoPaginated(
                estadoPedido, page, pageSize, fechaDesde, fechaHasta, sortBy, sortOrder
            );

            var response = OrderDTO.ToOrderResponse(orders);
            return (response, totalCount);
        }
        /*
        public bool CreateOrder(OrderRequest request, int tokenUserId)
        {
            
            var user = _UserRepository.GetUserById(tokenUserId);
            if (user == null) return false;
            foreach (var itemRequest in request.Items)
            {
                var productSize = _ProductSizeRepository.GetProductSizeById(itemRequest.ProductSizeId);
                if (productSize == null) return false;
                if (itemRequest.Cantidad <= 0) return false;
                if (productSize.Stock < itemRequest.Cantidad) return false;
            }
            var order = OrderDTO.ToOrderEntity(request);
            if (order == null) return false;
            _OrderRepository.AddOrder(order);
            int total = 0;
            foreach (var itemRequest in request.Items)
            {
                itemRequest.OrderId = order.Id;

                var productSize = _ProductSizeRepository.GetProductSizeById(itemRequest.ProductSizeId);
                if (productSize == null) continue;
                int precioUnitario = productSize.Product.Precio;
                total += precioUnitario * itemRequest.Cantidad;
                var result = _OrderItemService.CreateOrderItem(itemRequest,tokenUserId);
                if (!result) return false;
            }
            order.Total = total;
            _OrderRepository.UpdateOrder(order);
            return true;
        }
        */
        public bool CreateOrder(OrderRequest request, int tokenUserId)
        {
            // 1️⃣ Validación previa
            var user = _UserRepository.GetUserById(tokenUserId);
            if (user == null) return false;

            foreach (var itemRequest in request.Items)
            {
                var productSize = _ProductSizeRepository.GetProductSizeById(itemRequest.ProductSizeId);
                if (productSize == null) return false;       // FK ProductSize
                if (!productSize.Habilitado) return false;
                if (itemRequest.Cantidad <= 0) return false; // Cantidad válida
                if (productSize.Stock < itemRequest.Cantidad) return false; // Stock suficiente
            }

            // 2️⃣ Crear la orden
            var order = OrderDTO.ToOrderEntity(request);
            if (order == null) return false;

            order.UserId = tokenUserId; // asignar usuario
            _OrderRepository.AddOrder(order); // EF genera Order.Id

            int total = 0;

            // 3️⃣ Crear los OrderItems usando el OrderId recién generado
            foreach (var itemRequest in request.Items)
            {
                var productSize = _ProductSizeRepository.GetProductSizeById(itemRequest.ProductSizeId);
                if (productSize == null) continue; // evitar FK inválido

                int precioUnitario = productSize.Product.Precio;
                total += precioUnitario * itemRequest.Cantidad;

                var orderItem = new OrderItem
                {
                    OrderId = order.Id, // ID real generado por EF
                    ProductSizeId = itemRequest.ProductSizeId,
                    Cantidad = itemRequest.Cantidad,
                    Habilitado = true
                };
                _AuditLogRepository.Log(tokenUserId, "CreateOrder", $"OrderId={order.Id}, UserId={tokenUserId}");
                _OrderItemService.CreateOrderItem(orderItem ,tokenUserId);
            }

            // 4️⃣ Actualizar total de la orden
            order.Total = total;
            _OrderRepository.UpdateOrder(order);

            return true;
        }
        /*
        public bool UpdateOrder(OrderRequest request, int id, int tokenUserId)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return false;
            var user = _UserRepository.GetUserById(tokenUserId);
            if (user == null) return false;
            OrderDTO.ToOrderUpdate(order, request);
            _OrderRepository.UpdateOrder(order);
            foreach (var itemRequest in request.Items)
            {
                itemRequest.OrderId = order.Id;
            }
            _AuditLogRepository.Log(tokenUserId, "UpdateOrder", $"OrderId={id}, NuevaDireccion={request.Dirección_Envio}");
            return true;
        }
        */
        public bool UpdateOrder(string direccion, int id, int tokenUserId)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return false;

            order.Dirección_Envio = direccion;

            _OrderRepository.UpdateOrder(order);

            return true;
        }

        public bool CancelOrder(int id, int userId, string rolClaim)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return false;
            if (order.UserId != userId && rolClaim != "Admin") return false;
            if (order.EstadoPedido == EstadoPedido.Cancelado) return false;
            if (order.Habilitado == false || order.Pagada == true) return false;
            if (order.Confirmada || order.EstadoPedido == EstadoPedido.Proceso)
            {
                foreach (var item in order.OrderItems)
                {
                    var productSize = _ProductSizeRepository.GetProductSizeById(item.ProductSizeId);
                    if (productSize == null) continue;
                    productSize.Stock += item.Cantidad;
                    _ProductSizeRepository.UpdateProductSize(productSize);
                }
            }
            order.EstadoPedido = EstadoPedido.Cancelado;
            SoftDeleteOrder(id);
            _OrderRepository.UpdateOrder(order);
            return true;
        }
        
        public bool ConfirmOrder(int id)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return false;
            if (order.Confirmada || order.EstadoPedido == EstadoPedido.Cancelado || order.EstadoPedido == EstadoPedido.Finalizado || order.Habilitado == false || order.Pagada == true) return false;
            foreach (var item in order.OrderItems)
            {
                var productSize = _ProductSizeRepository.GetProductSizeById(item.ProductSizeId);
                if (productSize == null) return false;
                if (productSize.Habilitado == false) return false;
                if (productSize.Stock < item.Cantidad)
                    return false;
                productSize.Stock -= item.Cantidad;
                _ProductSizeRepository.UpdateProductSize(productSize);
            }
            order.Confirmada = true;
            order.EstadoPedido = EstadoPedido.Proceso;
            _OrderRepository.UpdateOrder(order);
            return true;
        }
       

        /*
        public Order? ConfirmOrder(int id)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return null;

            if (order.Confirmada ||
                order.EstadoPedido == EstadoPedido.Cancelado ||
                order.EstadoPedido == EstadoPedido.Finalizado ||
                order.Habilitado == false ||
                order.Pagada == true)
                return null;

            foreach (var item in order.OrderItems)
            {
                var productSize = _ProductSizeRepository.GetProductSizeById(item.ProductSizeId);
                if (productSize == null || productSize.Habilitado == false) return null;

                if (productSize.Stock < item.Cantidad) return null;

                productSize.Stock -= item.Cantidad;
                _ProductSizeRepository.UpdateProductSize(productSize);
            }

            order.Confirmada = true;
            order.EstadoPedido = EstadoPedido.Proceso;

            _OrderRepository.UpdateOrder(order);

            return order; // ← AHORA DEVUELVE LA ORDEN ACTUALIZADA
        }
        */

        public bool PagoOrder(int id)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return false;
            if (order.Confirmada == false) return false;
            if (order.Habilitado == false) return false;
            if (order.EstadoPedido == EstadoPedido.Cancelado || order.EstadoPedido == EstadoPedido.Finalizado) return false;
            if (order.Pagada == true)  return false;
            order.Pagada = true;
            _OrderRepository.UpdateOrder(order);
            return true;
        }

        public bool FinalizeOrder(int id)
        {
            var order = _OrderRepository.GetOrderById(id);
            if (order == null) return false;
            if (order.Confirmada == false) return false;
            if (order.Habilitado == false) return false;
            if (order.EstadoPedido == EstadoPedido.Cancelado || order.EstadoPedido == EstadoPedido.Finalizado) return false;
            if (order.Pagada == false) return false;
            order.EstadoPedido = EstadoPedido.Finalizado;
            foreach (var orderItem in order.OrderItems)
            {
                if (orderItem.Habilitado)
                {
                    var product = orderItem.ProductSize?.Product;
                    if (product != null)
                    {
                        product.TotalVentas += orderItem.Cantidad;
                    }
                }
            }
            _OrderRepository.UpdateOrder(order);
            return true;
        }

        public bool SoftDeleteOrder(int id)
        {
            var entity = _OrderRepository.GetOrderById(id);
            if (entity != null)
            {
                foreach(var size in entity.OrderItems)
{
                    size.Habilitado = !size.Habilitado;
                }
                entity.EstadoPedido = EstadoPedido.Cancelado;
                _OrderRepository.SoftDeleteOrder(entity);
                return true;
            }
            return false;
        }
        public bool HardDeleteOrder(int id)
        {
            var entity = _OrderRepository.GetOrderById(id);
            if (entity != null)
            {
                _OrderRepository.HardDeleteOrder(entity);
                return true;
            }
            return false;
        }

    }
}