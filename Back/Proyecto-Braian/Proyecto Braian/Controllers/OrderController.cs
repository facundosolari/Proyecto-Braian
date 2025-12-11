using Application.Interfaces;
using Application.Models.Request;
using Application.Models.Response;
using Application.Services;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Proyecto_Braian.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _OrderService;

        public OrderController(IOrderService OrderService)
        {
            _OrderService = OrderService;
        }

        [HttpGet("AllOrders")]
        [Authorize(Policy = "Admin")]
        public IActionResult GetAllOrders()
        {
            var Orders = _OrderService.GetAllOrders();
            return Ok(Orders);
        }

        [HttpGet("OrdersByUserId")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult GetOrdersByUserId(
            int page = 1,
            int pageSize = 20,
            bool? tieneMensajesNoLeidos = null,
            int? estado = null,
            DateTime? fechaDesde = null,
            DateTime? fechaHasta = null,
            string sortBy = "FechaHora",
            string sortOrder = "desc"
        )
        {
            // Obtener el Id del usuario desde el token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;

            if (userIdClaim == null)
                return Unauthorized("Token inválido");

            int userId = int.Parse(userIdClaim);

            // Saber si es admin
            bool esAdmin = User.IsInRole("Admin");

            var (orders, totalCount) = _OrderService.GetOrdersByUserIdPaginated(
                userId,
                page,
                pageSize,
                tieneMensajesNoLeidos,
                estado,
                esAdmin,
                fechaDesde,
                fechaHasta,
                sortBy,
                sortOrder
            );

            return Ok(new
            {
                Orders = orders,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("OrderId/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<OrderResponse?> GetOrderById([FromRoute] int id)
        {
            var Order = _OrderService.GetOrderById(id);
            return Ok(Order);
        }



        [HttpGet("byEstado")]
        [Authorize(Policy = "Admin")]
        public IActionResult GetOrdersByEstado(
    [FromQuery] int estadoPedido,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] DateTime? fechaDesde = null,
    [FromQuery] DateTime? fechaHasta = null,
    [FromQuery] bool? tieneMensajesNoLeidos = null,
    [FromQuery] string sortBy = "FechaHora",
    [FromQuery] string sortOrder = "desc") // "asc" o "desc"
        {
            try
            {
                bool esAdmin = true;
                var estadoEnum = (EstadoPedido)estadoPedido;

                var (orders, totalCount) = _OrderService.GetOrdersByEstadoPaginated(
                    estadoEnum, page, pageSize, fechaDesde, fechaHasta, tieneMensajesNoLeidos, esAdmin, sortBy, sortOrder
                );

                return Ok(new
                {
                    Orders = orders,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        [HttpPost("CreateOrder")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult CreateOrder([FromBody] OrderRequest request)
        {
            var userIdClaim = User.FindFirst("Id");
            if (userIdClaim == null)
                return Unauthorized("No se encontró el ID del usuario en el token.");
            int tokenUserId = int.Parse(userIdClaim.Value);
            var order = _OrderService.CreateOrder(request, tokenUserId);
            if (order == false)
            {
                return BadRequest("No se pudo crear la orden.");
            }
            return Ok($"Order creado con exito");
        }

        [HttpPut("UpdateAdress/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult UpdateOrderAddress(int id, [FromBody] OrderPatchRequest request)
        {
            var userId = int.Parse(User.FindFirst("Id")!.Value);
            var ok = _OrderService.UpdateOrder(request.Dirección_Envio, id, userId);

            if (!ok) return BadRequest("No se pudo actualizar la dirección.");

            return Ok("Dirección actualizada con éxito.");
        }


        // PUT api/<OrderController>/5
        [HttpPut("CancelOrder/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<bool> CancelOrder([FromRoute] int id)
        {
            var userIdClaim = User.FindFirst("Id");
            if (userIdClaim == null)
                return Unauthorized("No se encontró el ID del usuario en el token.");
            int tokenUserId = int.Parse(userIdClaim.Value);

            var roleClaim = User.FindFirst("Rol"); // <-- o "role", depende de cómo lo tengas en el JWT
            if (roleClaim == null)
                return Unauthorized("No se encontró el rol del usuario en el token.");
            string userRole = roleClaim.Value;



            var Order = _OrderService.CancelOrder(id, tokenUserId, userRole);
            return Ok($"Order {Order} cancelada con exito");
        }

        [HttpPut("ConfirmOrder/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> ConfirmOrder([FromRoute] int id)
        {
            var Order = _OrderService.ConfirmOrder(id);
            return Ok($"Order {Order} confirmada con exito");
        }

        [HttpPut("PagoOrder/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> PagoOrder([FromRoute] int id)
        {
            var Order = _OrderService.PagoOrder(id);
            return Ok($"Order {Order} pagada con exito");
        }

        [HttpPut("FinalizeOrder/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> FinalizeOrder([FromRoute] int id)
        {
            var order = _OrderService.FinalizeOrder(id); // implementar en tu servicio
            if (!order) return NotFound($"Orden {id} no encontrada o ya finalizada.");

            return Ok($"Order {id} finalizada con éxito");
        }

        /*
        // PUT api/<OrderController>/5
        [HttpPut("SoftDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> SoftDeleteOrder([FromRoute] int id)
        {
            var Order = _OrderService.SoftDeleteOrder(id);
            return Ok($"Order {Order} actualizado con exito");
        }



        // PUT api/<OrderController>/5
        [HttpDelete("HardDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> HardDeleteOrder([FromRoute] int id)
        {
            var Order = _OrderService.HardDeleteOrder(id);
            return Ok($"Order {Order} borrado con exito");
        }
        */


    }
}