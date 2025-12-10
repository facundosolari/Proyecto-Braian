using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Domain.Entities;
using Domain.Interfaces;
using Application.Interfaces;
using Application.Models.Request;
using Application.Models.Helpers;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Infrastructure.ThirdServices
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthenticationServiceOptions _options;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthenticationService(
            IUserRepository userRepository,
            IOptions<AuthenticationServiceOptions> options,
            IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _options = options.Value;
            _httpContextAccessor = httpContextAccessor;
        }

        private User? ValidateUser(AuthenticationRequest request)
        {
            var user = _userRepository.GetAllUsers()
                .FirstOrDefault(u => u.Usuario == request.Usuario && u.Contraseña == request.Contraseña);

            if (user != null && !user.Habilitado)
                throw new UnauthorizedAccessException("El usuario ha sido desactivado.");

            return user;
        }

        public string Authenticate(AuthenticationRequest request)
        {
            int tiempoMinutos = 15;
            var user = ValidateUser(request);
            if (user == null)
                throw new UnauthorizedAccessException("Authentication failed");

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_options.SecretForKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("Rol", user.Rol.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(tiempoMinutos), // tiempo del token
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Guardar cookie HttpOnly
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(tiempoMinutos) // tiempo de la cookie
            };

            _httpContextAccessor.HttpContext?.Response.Cookies.Append("AuthCookie", tokenString, cookieOptions);

            return tokenString;
        }
    }
}