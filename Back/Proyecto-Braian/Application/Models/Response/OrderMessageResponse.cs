using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class OrderMessageResponse
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string? Message { get; set; }
        public DateTime FechaHoraMessage { get; set; }
        public string SenderRole { get; set; } = string.Empty;
        public int SenderId { get; set; }

        // Lectura diferenciada según rol
        public bool LeidoPorAdmin { get; set; }
        public bool LeidoPorUser { get; set; }
        public bool Habilitado { get; set; }
    }
}
