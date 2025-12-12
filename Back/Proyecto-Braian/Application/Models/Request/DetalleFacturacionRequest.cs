using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class DetalleFacturacionRequest
    {
        public required string Nombre { get; set; } 
        public required string Apellido { get; set; }
        public required string Direccion { get; set; }
        public required string Ciudad { get; set; }
        public required string Provincia { get; set; }
        public required string Pais { get; set; }
        public required string CodigoPostal { get; set; }
        public required string Email { get; set; }
        public required string CodigoArea { get; set; }
        public required string NumeroTelefono { get; set; }
        public required string Documento { get; set; }
    }
}
