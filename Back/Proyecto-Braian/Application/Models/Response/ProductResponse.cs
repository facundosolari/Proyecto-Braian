using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int Precio { get; set; }
        public List<ProductSizeResponse>? Sizes { get; set; }
        public bool Habilitado { get; set; }
        public List<string>? Fotos { get; set; }
        public List<CategoryResponse>? Categories { get; set; }
        public int TotalVentas { get; set; }
    }
}
