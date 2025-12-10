using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public bool Habilitado { get; set; }
        public List<ProductResponse>? Productos { get; set; }

        // Agregado: subcategorías
        public List<CategoryResponse>? SubCategories { get; set; } = new List<CategoryResponse>();
        public int? ParentCategoryResponse { get; set; } = null;
    }
}
