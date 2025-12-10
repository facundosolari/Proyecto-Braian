using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enum;

namespace Application.Models.Response
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string? Usuario { get; set; }
        public string? Contraseña { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Celular { get; set; }
        public string? Email { get; set; }
        public Rol Rol { get; set; }
        public bool Habilitado { get; set; }
    }
}
