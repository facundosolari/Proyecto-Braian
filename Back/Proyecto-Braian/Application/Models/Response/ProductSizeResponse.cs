using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class ProductSizeResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? Talle { get; set; }
        public int Stock { get; set; }
        public bool Habilitado { get; set; }
    }
}
