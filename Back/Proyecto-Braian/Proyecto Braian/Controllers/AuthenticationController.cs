/*
using Application.Interfaces;
using Application.Models.Request;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private readonly IAuthenticationService _customAuthenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _customAuthenticationService = authenticationService;
        }

        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticationRequest authenticationRequest)
        {
            try
            {
                string token = _customAuthenticationService.Authenticate(authenticationRequest);

                // 👉 Setear JWT como cookie segura
                Response.Cookies.Append(
                    "jwt",
                    token,
                    new CookieOptions
                    {
                        HttpOnly = true,            // El frontend NO puede acceder via JS
                        Secure = true,              // Solo HTTPS
                        SameSite = SameSiteMode.Strict, // Evita CSRF
                        Expires = DateTime.UtcNow.AddHours(12),
                        Path = "/"
                    }
                );

                return Ok(new
                {
                    message = "Login correcto",
                    token = token
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                if (ex.Message == "El usuario ha sido desactivado.")
                {
                    return Unauthorized(new { message = "El usuario ha sido desactivado. Contacte con soporte." });
                }
                return Unauthorized(new { message = "Credenciales incorrectas. Por favor, inténtelo de nuevo." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor.", details = ex.Message });
            }
        }

        // 👉 Logout (Elimina cookie)
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new { message = "Logout correcto" });
        }

    }
}
*/
using Application.Interfaces;
using Application.Models.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly IUserService _userService;

        public AuthenticationController(IAuthenticationService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        // -----------------------------------
        // LOGIN
        // La cookie se escribe SOLO en AuthenticationService
        // -----------------------------------
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticationRequest request)
        {
            try
            {
                // 🔹 Esto ya genera la cookie correcta: HttpOnly, Secure, SameSite=None
                _authService.Authenticate(request);

                return Ok(new { message = "Logueado correctamente" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno", details = ex.Message });
            }
        }

        // -----------------------------------
        // LOGOUT
        // -----------------------------------
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // ⚡ Borrar la cookie con los mismos parámetros con que fue creada
            Response.Cookies.Delete("AuthCookie", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/" // importante que coincida con la cookie creada
            });

            return Ok(new { message = "Sesión cerrada" });
        }

        // -----------------------------------
        // USUARIO LOGUEADO
        // -----------------------------------
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var user = _userService.GetUserById(userId);
            return Ok(user);
        }
    }
}