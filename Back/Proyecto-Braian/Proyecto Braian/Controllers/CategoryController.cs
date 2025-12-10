using Application.Interfaces;
using Application.Models.Request;
using Application.Models.Response;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Proyecto_Braian.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET api/category/{id}
        [HttpGet("GetCategoryBy/{id}")]
        public ActionResult<CategoryResponse?> GetCategoryById([FromRoute] int id)
        {
            var category = _categoryService.GetCategoryById(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }
        [HttpGet("AllCategories")]
        public IActionResult GetAllCategories()
        {
            var Categories = _categoryService.GetAllCategories();
            return Ok(Categories);
        }

        // POST api/category
        [HttpPost("CreateCategory")]
        [Authorize(Policy = "Admin")]
        public IActionResult CreateCategory([FromBody] CategoryRequest request)
        {
            var created = _categoryService.CreateCategory(request);

            if (!created)
                return BadRequest("No se pudo crear la categoría.");

            return Ok("Categoría creada con éxito.");
        }

        // PUT api/category/{id}
        [HttpPut("UpdateCategoryBy/{id}")]
        [Authorize(Policy = "Admin")]
        public IActionResult UpdateCategory([FromRoute] int id, [FromBody] CategoryRequest request)
        {
            var updated = _categoryService.UpdateCategory(id, request);

            if (!updated)
                return BadRequest($"No se pudo actualizar la categoría con id {id}.");

            return Ok($"Categoría {id} actualizada con éxito.");
        }

        // PUT api/category/AssignProducts/{categoryId}
        [HttpPut("AssignProducts/{categoryId}")]
        [Authorize(Policy = "Admin")]
        public IActionResult AssignProductsToCategory([FromRoute] int categoryId, [FromBody] List<int> productIds)
        {
            var result = _categoryService.AssignProductsToCategory(categoryId, productIds);

            if (!result)
                return BadRequest("No se pudo asignar los productos a la categoría.");

            return Ok("Productos asignados correctamente a la categoría.");
        }

        // PUT api/category/SoftDelete/{id}
        [HttpPut("SoftDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public IActionResult SoftDeleteCategory([FromRoute] int id)
        {
            var deleted = _categoryService.SoftDeleteCategory(id);

            if (!deleted)
                return BadRequest("No se pudo deshabilitar la categoría.");

            return Ok($"Categoría {id} deshabilitada con éxito.");
        }

        // DELETE api/category/HardDelete/{id}
        [HttpDelete("HardDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public IActionResult HardDeleteCategory([FromRoute] int id)
        {
            var deleted = _categoryService.HardDeleteCategory(id);

            if (!deleted)
                return BadRequest("No se pudo eliminar la categoría.");

            return Ok($"Categoría {id} eliminada permanentemente.");
        }
    }
}