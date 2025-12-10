using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IUserRepository
    {
        List<User> GetAllUsers();
        User? GetUserById(int id);
        bool ExistsByUsername(string usuario);
        bool ExistsByEmail(string email);
        void AddUser(User entity);
        void UpdateUser(User entity);
        void SoftDeleteUser(User entity);
        void HardDeleteUser(User entity);
    }
}
