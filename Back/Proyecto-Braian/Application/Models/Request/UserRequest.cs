using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class UserRequest
    {
        public required string Usuario { get; set; }
        public required string Contraseña { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Celular { get; set; } = string.Empty;
        public required string Email {  get; set; }
    }
}
