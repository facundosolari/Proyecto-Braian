using Application.Interfaces;
using Application.Models.Request;
using Application.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Proyecto_Braian.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItemService _OrderItemService;

        public OrderItemController(IOrderItemService OrderItemService)
        {
            _OrderItemService = OrderItemService;
        }
        /*
        [HttpGet("AllOrderItems")]
        [Authorize(Policy = "Admin")]
        public IActionResult GetAllOrderItems()
        {
            var OrderItems = _OrderItemService.GetAllOrderItems();
            return Ok(OrderItems);
        }

        [HttpGet("OrderItemId/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<OrderItemResponse?> GetOrderItemById([FromRoute] int id)
        {
            var OrderItem = _OrderItemService.GetOrderItemById(id);
            return Ok(OrderItem);
        }


        [HttpPost("CreateOrderItem")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult CreateOrderItem([FromBody] OrderItemRequest request)
        {
            var userIdClaim = User.FindFirst("Id");
            if (userIdClaim == null) return Unauthorized();

            int tokenUserId = int.Parse(userIdClaim.Value);
            var order = _OrderItemService.CreateOrderItem(request, tokenUserId);
            if (order == false)
            {
                return BadRequest("No se pudo crear el OrderItem.");
            }
            return Ok($"OrderItem creado con exito");
        }



        // PUT api/<OrderItemController>/5
        [HttpPut("UpdateOrderItemByAdmin/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> UpdateOrderItemById([FromRoute] int id, [FromBody] OrderItemRequest request)
        {
            var OrderItem = _OrderItemService.UpdateOrderItemAdmin(request, id);
            return Ok($"OrderItem {OrderItem} actualizado con exito");
        }

        // PUT api/<OrderItemController>/5
        [HttpPatch("UpdateOrderItemById/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<bool> UpdateOrderItemById([FromRoute] int id, [FromBody] OrderItemPatchRequest request)
        {
            var userIdClaim = User.FindFirst("Id");
            if (userIdClaim == null) return Unauthorized();

            int tokenUserId = int.Parse(userIdClaim.Value);
            var OrderItem = _OrderItemService.UpdateOrderItem(request, id, tokenUserId);
            if (OrderItem == true)
            {
                return Ok($"OrderItem {OrderItem} actualizado con exito");
            }
            return Ok($"No se puedo actualizar {OrderItem}");
        }

        // PUT api/<OrderItemController>/5
        [HttpPut("SoftDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> SoftDeleteOrderItem([FromRoute] int id)
        {
            var OrderItem = _OrderItemService.SoftDeleteOrderItem(id);
            return Ok($"OrderItem {OrderItem} actualizado con exito");
        }

        // PUT api/<OrderItemController>/5
        [HttpDelete("HardDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> HardDeleteOrderItem([FromRoute] int id)
        {
            var OrderItem = _OrderItemService.HardDeleteOrderItem(id);
            return Ok($"OrderItem {OrderItem} borrado con exito");
        }

        */

    }
}
