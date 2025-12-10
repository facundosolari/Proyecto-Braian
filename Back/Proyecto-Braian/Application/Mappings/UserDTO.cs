using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Entities;

namespace Application.Mappings
{
    public static class UserDTO
    {
        public static User ToUserEntity (UserRequest request)
        {
            return new User()
            {

                Usuario = request.Usuario,
                Contraseña = request.Contraseña,
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Celular = request.Celular,
                Email = request.Email,
            };
        }

        public static UserResponse? ToUserResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Usuario = user.Usuario,
                Contraseña = user.Contraseña,
                Nombre = user.Nombre,
                Apellido = user.Apellido,
                Celular = user.Celular,
                Email = user.Email,
                Rol = user.Rol,
                Habilitado = user.Habilitado,
            };
        }

        public static List<UserResponse>? ToUserResponse(List<User> users)
        {
             return users.Select(x => new UserResponse
             { 
                 Id = x.Id,
                 Usuario = x.Usuario,
                 Contraseña = x.Contraseña,
                 Nombre = x.Nombre,
                 Apellido= x.Apellido,
                 Celular= x.Celular,
                 Email = x.Email,
                 Rol = x.Rol,
                 Habilitado = x.Habilitado,
             }).ToList();
        }

        public static void ToUserUpdateAdmin (UserRequest request, User user)
        {
            user.Usuario = request.Usuario;
            user.Contraseña = request.Contraseña;
            user.Nombre = request.Nombre;
            user.Apellido = request.Apellido;
            user.Celular = request.Celular;
            user.Email = request.Email;
        }

        public static void ToUserUpdate(UserPatchRequest request, User user)
        {
            user.Nombre = request.Nombre;
            user.Apellido = request.Apellido;
            user.Celular = request.Celular;
            user.Email = request.Email;
        }
    }
}
