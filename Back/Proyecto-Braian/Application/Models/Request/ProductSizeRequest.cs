using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class ProductSizeRequest
    {
        public required int ProductId { get; set; }
        public required string Talle { get; set; }
        public int Stock { get; set; }
    }
}
