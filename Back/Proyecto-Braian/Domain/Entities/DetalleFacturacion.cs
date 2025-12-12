using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class DetalleFacturacion
    {
        public int Id { get; set; }

        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
        public string Pais { get; set; }
        public string CodigoPostal { get; set; }
        public string Email { get; set; }
        public string CodigoArea { get; set; }
        public string NumeroTelefono { get; set; }
        public string Documento { get; set; }  // DNI / CUIT / CUIL

        // Relación uno a uno
        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}
