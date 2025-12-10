using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace Application.Models.Request
{
    public class AuthenticationRequest
    {
        [Required]
        public string Usuario { get; set; } = string.Empty;
        [Required]
        public string Contraseña { get; set; } = string.Empty;
    }
}