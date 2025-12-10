using Application.Interfaces;
using Application.Mappings;
using Application.Models.Request;
using Application.Models.Response;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Proyecto_Braian.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _ProductService;

        public ProductController(IProductService ProductService)
        {
            _ProductService = ProductService;
        }

        [HttpGet("AllProducts")]
        public IActionResult GetAllProducts()
        {
            var Products = _ProductService.GetAllProducts();
            return Ok(Products);
        }

        [HttpGet("ProductId/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<ProductResponse?> GetProductById([FromRoute] int id)
        {
            var Product = _ProductService.GetProductById(id);
            if (Product == null)
            {
                return NotFound();
            }
            return Ok(Product);
        }
        /*
                [HttpGet("ProductName/{name}")]
                public ActionResult<ProductResponse?> GetProductByName([FromRoute] string name)
                {
                    var Product = _ProductService.GetProductByName(name);
                    if (Product == null)
                    {
                        return NotFound();
                    }
                    return Ok(Product);
                }
        */

        [HttpPost("CreateProduct")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductRequest request, [FromForm] List<IFormFile>? images)
        {
            var urls = new List<string>();

            if (images != null && images.Count > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/products");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                foreach (var image in images)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    var relativeUrl = $"/images/products/{fileName}";
                    urls.Add(relativeUrl);
                }
            }

            request.Fotos = urls; // guardamos las URLs en el request
            _ProductService.CreateProduct(request);

            return Ok(new { message = "Producto creado con éxito", fotos = urls });
        }

        /*
        [HttpPost("CreateProduct")]
        [Authorize(Policy = "Admin")]
        public IActionResult CreateProduct([FromBody] ProductRequest request)
        {
            _ProductService.CreateProduct(request);
            return Ok($"Product creado con exito");
        }

        */

        // PUT api/<ProductController>/5

        /*
        [HttpPut("UpdateProductById/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> UpdateProductById([FromRoute] int id, [FromBody] ProductRequest request)
        {
            var Product = _ProductService.UpdateProduct(request, id);
            return Ok($"Product {Product} actualizado con exito");
        }
        */

        [HttpPut("UpdateProductById/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> UpdateProductById(
    [FromRoute] int id,
    [FromForm] string Nombre,
    [FromForm] string Descripcion,
    [FromForm] int Precio,
    [FromForm] List<string>? existingPhotos,
    [FromForm] List<int>? CategoryIds,
    [FromForm] List<IFormFile>? images
)
        {
            // Crear la lista final de fotos
            var finalPhotos = existingPhotos ?? new List<string>();

            if (images != null && images.Count > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/products");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                foreach (var image in images)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    var relativeUrl = $"/images/products/{fileName}";
                    finalPhotos.Add(relativeUrl);
                }
            }

            // Mapear al DTO
            var request = new ProductRequest
            {
                Nombre = Nombre,
                Descripcion = Descripcion,
                Precio = Precio,
                Fotos = finalPhotos,
                CategoryIds = CategoryIds ?? new List<int>()   // <- asignar categorías
            };

            var updated = _ProductService.UpdateProduct(request, id);

            if (!updated) return BadRequest("No se pudo actualizar el producto");

            return Ok($"Producto {id} actualizado con éxito");
        }

        [HttpGet("Paged")]
        public IActionResult GetProductsPaged(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] string? sortBy = null,
    [FromQuery] List<int>? categoryIds = null,
    [FromQuery] List<string>? sizeIds = null,  // ← cambiar a string
    [FromQuery] decimal? minPrice = null,
    [FromQuery] decimal? maxPrice = null,
    [FromQuery] bool onlyEnabled = false,
    [FromQuery] string? searchName = null
)
        {
            var (products, totalCount) = _ProductService.GetProductsPaged(
                page, pageSize, sortBy, categoryIds, sizeIds, minPrice, maxPrice, onlyEnabled, searchName
            );

            return Ok(new
            {
                items = products,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                totalCount
            });
        }

        // PUT api/<ProductController>/5
        [HttpPut("SoftDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> SoftDeleteProduct([FromRoute] int id)
        {
            var Product = _ProductService.SoftDeleteProduct(id);
            return Ok($"Product {Product} actualizado con exito");
        }
        /*
        // PUT api/<ProductController>/5
        [HttpDelete("HardDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> HardDeleteProduct([FromRoute] int id)
        {
            var Product = _ProductService.SoftDeleteProduct(id);
            return Ok($"Product {Product} borrado con exito");
        }
        */


    }
}