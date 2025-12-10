using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string Usuario { get; set; }
        public required string Contraseña { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Celular { get; set; }
        public string? Email { get; set; }
        public Rol Rol { get; set; } = Rol.User;
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public bool Habilitado { get; set; } = true;

    }
}
