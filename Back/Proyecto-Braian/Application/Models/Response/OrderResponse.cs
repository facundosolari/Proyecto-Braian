using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<OrderItemResponse>? OrderItems { get; set; }
        public DateTime FechaHora { get; set; }
        public bool Confirmada { get; set; }
        public bool Pagada { get; set; }
        public int Total { get; set; }
        public EstadoPedido EstadoPedido { get; set; }
        public bool Habilitado { get; set; }
        public string Dirección_Envio { get; set; }
    }
}
