using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int Precio { get; set; }
        public List<Category>? Categories { get; set; } = new List<Category>();
        public ICollection<ProductSize>? Sizes { get; set; } = new List<ProductSize>();
        public bool Habilitado { get; set; } = true;
        public List<string>? Fotos { get; set; } = new List<string>();
        public int TotalVentas { get; set; } = 0;
    }
}
