using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class OrderItemRequest
    {
        public int OrderId {  get; set; }
        public required int ProductSizeId { get; set; }
        public int Cantidad { get; set; }
    }
}
