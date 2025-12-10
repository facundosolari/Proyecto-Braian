using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Response
{
    public class OrderItemResponse
    {
        public int Id { get; set; }
        public int ProductSizeId { get; set; }
        public int OrderId { get; set; }
        public int Cantidad { get; set; }
        public bool Habilitado { get; set; }

        // 🔥 Nuevos datos enriquecidos
        public int ProductId { get; set; }
        public string Talle { get; set; }
        public string NombreProducto { get; set; }
        public int Precio { get; set; }
        public List<string> Fotos { get; set; }

        public int Subtotal => Precio * Cantidad;
    }
}


