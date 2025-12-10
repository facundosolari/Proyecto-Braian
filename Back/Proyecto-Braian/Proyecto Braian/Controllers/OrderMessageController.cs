using Application.Interfaces;
using Application.Models.Request;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Proyecto_Braian.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderMessageController : ControllerBase
    {
        private readonly IOrderMessageService _OrderMessageService;

        public OrderMessageController(IOrderMessageService OrderMessageService)
        {
            _OrderMessageService = OrderMessageService;
        }

        [HttpGet("AllOrderMessages")]
        [Authorize(Policy = "Admin")]
        public IActionResult GetAllOrders()
        {
            var orderMessages = _OrderMessageService.GetAllOrderMessages();
            return Ok(orderMessages);
        }

        [HttpGet("OrderMessageById/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult GetOrderMessageById([FromRoute] int id)
        {
            var orderMessages = _OrderMessageService.GetOrderMessageById(id);
            return Ok(orderMessages);
        }

        [HttpGet("OrderMessagesByOrderId/{orderId}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult GetMessagesByOrderId([FromRoute] int orderId)
        {
            var messages = _OrderMessageService.GetAllOrderMessagesByOrderId(orderId);
            return Ok(messages);
        }

        [HttpPost("CreateOrderMessage")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult CreateOrderMessage([FromBody] OrderMessageRequest request)
        {
            var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var role = User.FindFirst("Rol")?.Value ?? "User";

            var success = _OrderMessageService.CreateMessage(request, userId, role);
            return Ok(success);
        }

        [HttpPut("MarkAsRead/{orderId}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult MarkMessagesAsRead(int orderId)
        {
            var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var role = User.FindFirst("Rol")?.Value ?? "User";

            var success = _OrderMessageService.MarkMessagesAsRead(orderId, role, userId);

            if (!success)
                return BadRequest("No se pudieron marcar como leídos.");

            return Ok(true);
        }

        [HttpGet("UnreadCount/{orderId}")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<IActionResult> GetUnreadCount(int orderId)
        {
            // Obtenemos usuario del token o sesión
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == "Rol")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(roleClaim))
                return Unauthorized();

            int userId = int.Parse(userIdClaim);
            string userRole = roleClaim;

            int count = await _OrderMessageService.GetUnreadCountAsync(orderId, userId, userRole);

            return Ok(new { orderId, unreadCount = count });
        }
        /*

        [HttpPut("UpdateOrderMessage/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult UpdateOrderMessage([FromRoute] int id, [FromBody] OrderMessageRequest request)
        {
            var message = _OrderMessageService.UpdateMessage(request, id);
            return Ok(message);
        }

        
        [HttpPut("SoftDeleteOrderMessage/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult SoftDeleteOrderMessage([FromRoute] int id)
        {
            var message = _OrderMessageService.SoftDeleteMessage(id);
            return Ok(message);
        }
        */
    }
}