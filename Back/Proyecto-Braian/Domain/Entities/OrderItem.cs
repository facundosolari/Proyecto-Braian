using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductSizeId { get; set; }
        public int OrderId { get; set; }
        public ProductSize? ProductSize { get; set; }
        public Order? Order { get; set; }
        public int Cantidad { get; set; }
        public bool Habilitado { get; set; } = true;

    }
}
