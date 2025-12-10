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
    public class ProductSizeController : ControllerBase
    {
        private readonly IProductSizeService _ProductSizeService;

        public ProductSizeController(IProductSizeService ProductSizeService)
        {
            _ProductSizeService = ProductSizeService;
        }

        [HttpGet("AllProductSizes")]
        public IActionResult GetAllProductSizes()
        {
            var ProductSizes = _ProductSizeService.GetAllProductSizes();
            return Ok(ProductSizes);
        }

        [HttpGet("ProductSizeId/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<ProductSizeResponse?> GetProductSizeById([FromRoute] int id)
        {
            var ProductSize = _ProductSizeService.GetProductSizeById(id);
            if (ProductSize == null)
            {
                return NotFound();
            }
            return Ok(ProductSize);
        }


        [HttpPost("CreateProductSize")]
        [Authorize(Policy = "Admin")]
        public IActionResult CreateProductSize([FromBody] ProductSizeRequest request)
        {
            _ProductSizeService.CreateProductSize(request);
            return Ok($"ProductSize creado con exito");
        }



        // PUT api/<ProductSizeController>/5
        [HttpPut("UpdateProductSizeById/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> UpdateProductSizeById([FromRoute] int id, [FromBody] ProductSizeRequest request)
        {
            var ProductSize = _ProductSizeService.UpdateProductSize(request, id);
            return Ok($"ProductSize {ProductSize} actualizado con exito");
        }

        
        // PUT api/<ProductSizeController>/5
        [HttpPut("SoftDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> SoftDeleteProductSize([FromRoute] int id)
        {
            var ProductSize = _ProductSizeService.SoftDeleteProductSize(id);
            return Ok($"ProductSize {ProductSize} actualizado con exito");
        }
        /*
        // PUT api/<ProductSizeController>/5
        [HttpDelete("HardDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> HardDeleteProductSize([FromRoute] int id)
        {
            var ProductSize = _ProductSizeService.SoftDeleteProductSize(id);
            return Ok($"ProductSize {ProductSize} borrado con exito");
        }

        */

    }
}