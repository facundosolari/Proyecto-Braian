using Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class ProductRequest
    {
        public required string Nombre { get; set; }
        public required string Descripcion { get; set; }
        public required int Precio { get; set; }
        public List<int> CategoryIds { get; set; } = new List<int>();
        public ICollection<ProductSizeRequest> Sizes { get; set; } = new List<ProductSizeRequest>();
        public List<string>? Fotos { get; set; } 
    }
}
