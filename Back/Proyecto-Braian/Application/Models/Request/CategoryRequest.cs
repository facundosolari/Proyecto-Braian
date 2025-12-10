using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class CategoryRequest
    {
        public required string Nombre { get; set; }
        public List<int>? ProductsIds { get; set; } = new List<int>();
        public int? ParentCategoryId { get; set; } = null;
    }
}
