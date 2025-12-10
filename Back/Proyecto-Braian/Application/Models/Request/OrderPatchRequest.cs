using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Request
{
    public class OrderPatchRequest
    {
        public required string Dirección_Envio { get; set; }
    }
}
