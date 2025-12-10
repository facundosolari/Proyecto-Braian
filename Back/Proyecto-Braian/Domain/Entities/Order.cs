using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enum;

namespace Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public DateTime FechaHora { get; set; } = DateTime.Now;
        public List<OrderMessage> Messages { get; set; } = new List<OrderMessage>();
        public bool Confirmada { get; set; } = false;
        public bool Pagada {  get; set; } = false;
        public int Total { get; set; }
        public EstadoPedido EstadoPedido { get; set; } = EstadoPedido.Pendiente;
        public bool Habilitado { get; set; } = true;
        public string Dirección_Envio {  get; set; } 
    }
}
