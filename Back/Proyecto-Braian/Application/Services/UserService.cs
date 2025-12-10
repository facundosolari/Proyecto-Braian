using Application.Interfaces;
using Application.Mappings;
using Application.Models.Request;
using Application.Models.Response;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public UserResponse? GetUserById(int id)
        {
            var user = _userRepository.GetUserById(id);
            if (user != null)
            {
                return UserDTO.ToUserResponse(user);
            }
            return null;

        }
        public List<UserResponse>? GetAllUsers()
        {
            var users = _userRepository.GetAllUsers();
            if (users != null)
            {
                return UserDTO.ToUserResponse(users);
            }
            return null;
        }

        public bool CreateUser(UserRequest request)
        {
            if (_userRepository.ExistsByUsername(request.Usuario) ||
            _userRepository.ExistsByEmail(request.Email))
            {
                return false;
            }
            var user = UserDTO.ToUserEntity(request);
            if (user != null)
            {
                _userRepository.AddUser(user);
                return true;
            }
            return false;
        }

        public bool UpdateUserAdmin(UserRequest request, int id)
        {
            if (_userRepository.ExistsByUsername(request.Usuario) ||
            _userRepository.ExistsByEmail(request.Email))
            {
                return false;
            }
            var entity = _userRepository.GetUserById(id);
            if (entity != null)
            {
                UserDTO.ToUserUpdateAdmin(request, entity);
                _userRepository.UpdateUser(entity);
                return true;
            }
            return false;
        }

        public bool UpdateUser(UserPatchRequest request, int id, int tokenUserId)
        {
            if (tokenUserId != id)
            {
                return false;
            }
            if (!string.IsNullOrEmpty(request.Email) && _userRepository.ExistsByEmail(request.Email))
                return false;
            
            var entity = _userRepository.GetUserById(id);
            if (entity != null)
            {
                UserDTO.ToUserUpdate(request, entity);
                _userRepository.UpdateUser(entity);
                return true;
            }
            return false;
        }

        public bool SoftDeleteUser(int id)
        {
            var entity = _userRepository.GetUserById(id);
            if (entity != null)
            {
                _userRepository.SoftDeleteUser(entity);
                return true;
            }
            return false;
        }
        public bool HardDeleteUser(int id)
        {
            var entity = _userRepository.GetUserById(id);
            if (entity != null)
            {
                _userRepository.HardDeleteUser(entity);
                return true;
            }
            return false;
        }

    }
}
