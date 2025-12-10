using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ProductSize
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public required string Talle { get; set; }   // "S", "M", "L", "42", etc.
        public int Stock { get; set; }

        public Product? Product { get; set; }
        public bool Habilitado { get; set; } = true;
        public ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
    }
}
