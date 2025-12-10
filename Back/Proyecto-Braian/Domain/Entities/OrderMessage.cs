using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OrderMessage
    {
        public int Id { get; set; }
        public Order? Order { get; set; }
        public int OrderId { get; set; }
        public string? Message { get; set; }
        public DateTime FechaHoraMessage { get; set; } = DateTime.Now;
        public string SenderRole { get; set; } // "Admin" o "User"
        public int SenderId { get; set; }

        // Lectura diferenciada
        public bool LeidoPorAdmin { get; set; }
        public bool LeidoPorUser { get; set; }
        public bool Habilitado { get; set; } = true;
    }
}
