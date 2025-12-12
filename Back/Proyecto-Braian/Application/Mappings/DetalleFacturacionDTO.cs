using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Mappings
{
    public static class DetalleFacturacionDTO
    {
        // Ahora recibe senderId y senderRole al crear el mensaje
        public static DetalleFacturacion ToDetalleFacturacionEntity(DetalleFacturacionRequest request)
        {
            return new DetalleFacturacion
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Direccion = request.Direccion,
                Ciudad = request.Ciudad,
                Provincia = request.Provincia,
                Pais = request.Pais,
                CodigoPostal = request.CodigoPostal,
                Email = request.Email,
                CodigoArea = request.CodigoArea,
                NumeroTelefono = request.NumeroTelefono,
                Documento = request.Documento,
            };
        }

        public static DetalleFacturacionResponse? ToDetalleFacturacionResponse(DetalleFacturacion? entity)
        {
            if (entity == null) return null;
            return new DetalleFacturacionResponse
            {
                Nombre = entity.Nombre,
                Apellido = entity.Apellido,
                Direccion = entity.Direccion,
                Ciudad = entity.Ciudad,
                Provincia = entity.Provincia,
                Pais = entity.Pais,
                CodigoPostal = entity.CodigoPostal,
                Email = entity.Email,
                CodigoArea = entity.CodigoArea,
                NumeroTelefono = entity.NumeroTelefono,
                Documento = entity.Documento,
            };
        }

        public static List<DetalleFacturacionResponse> ToDetalleFacturacionResponseList(List<DetalleFacturacion> entities)
        {
            return entities.Select(ToDetalleFacturacionResponse).ToList();
        }

        public static void ToUpdateDetalleFacturacion(DetalleFacturacion entity, DetalleFacturacionRequest request)
        {
            entity.Nombre = request.Nombre;
            entity.Apellido = request.Apellido;
                entity.Direccion = request.Direccion;
                entity.Ciudad = request.Ciudad;
                entity.Provincia = request.Provincia;
                entity.Pais = request.Pais;
                 entity.CodigoPostal = request.CodigoPostal;
                entity.Email = request.Email;
                entity.CodigoArea = request.CodigoArea;
                entity.NumeroTelefono = request.NumeroTelefono;
               entity.Documento= request.Documento;
        }
    }
}
