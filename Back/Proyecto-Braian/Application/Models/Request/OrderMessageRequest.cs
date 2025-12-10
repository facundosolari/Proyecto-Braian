using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class OrderMessageRequest
    {
        public int OrderId { get; set; }
        public string? Message { get; set; } = string.Empty;

        // Nuevo
        public int SenderId { get; set; }
        public string SenderRole { get; set; } = string.Empty; // "Admin" o "User"
    }
}
