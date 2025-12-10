using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models.Request;
using Application.Models.Response;
using Microsoft.AspNetCore.Http.HttpResults;
using Domain.Entities;

namespace Proyecto_Braian.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _UserService;

        public UserController(IUserService UserService)
        {
            _UserService = UserService;
        }

        [HttpGet("AllUsers")]
        [Authorize(Policy = "Admin")]
        public IActionResult GetAllUsers()
        {
            var Users = _UserService.GetAllUsers();
            return Ok(Users);
        }

        [HttpGet("UserId/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<UserResponse?> GetUserById([FromRoute] int id)
        {
            var User = _UserService.GetUserById(id);
            return Ok(User);
        }


        [HttpPost("CreateUser")]
        public IActionResult CreateUser([FromBody] UserRequest request)
        {
            
            var user = _UserService.CreateUser(request);
            if (!user)
                return BadRequest("No se pudo crear el usuario.");
            return Ok($"User creado con exito");
        }


        /*
        // PUT api/<UserController>/5
        [HttpPut("UpdateUserByAdmin/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> UpdateUserByAdmin([FromRoute] int id, [FromBody] UserRequest request)
        {
       
            var user = _UserService.UpdateUserAdmin(request, id);
            if (!user)
                return BadRequest("No se pudo actualizar el usuario.");
            return Ok($"User {user} actualizado con exito");
        }
        */
        [HttpPut("UpdateUserById/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<bool> UpdateUserById([FromRoute] int id, [FromBody] UserPatchRequest request)
        {
            var userIdClaim = User.FindFirst("Id");
            if (userIdClaim == null)
                return Unauthorized("No se encontró el ID del usuario en el token.");
            int tokenUserId = int.Parse(userIdClaim.Value);
            var user = _UserService.UpdateUser(request, id, tokenUserId);
            return Ok($"User {User} actualizado con exito");
        }

        /*
        // PUT api/<UserController>/5
        [HttpPut("SoftDelete/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public ActionResult<bool> SoftDeleteUser([FromRoute] int id)
        {
            var User = _UserService.SoftDeleteUser (id);
            return Ok($"User {User} actualizado con exito");
        }

        // PUT api/<UserController>/5
        [HttpDelete("HardDelete/{id}")]
        [Authorize(Policy = "Admin")]
        public ActionResult<bool> HardDeleteUser([FromRoute] int id)
        {
            var User = _UserService.SoftDeleteUser(id);
            return Ok($"User {User} borrado con exito");
        }

        */

    }
}
