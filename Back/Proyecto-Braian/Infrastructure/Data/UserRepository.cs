using Infrastructure.Context;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Infrastructure.Data
{
    public class UserRepository : IUserRepository
    {

        private readonly DataBaseContext _databaseContext;

        public UserRepository(DataBaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public List<User> GetAllUsers()
        {
            return _databaseContext.Users.ToList();
        }
        public User? GetUserById(int id)
        {
            return _databaseContext.Users.FirstOrDefault(x => x.Id.Equals(id));
        }

        public bool ExistsByUsername(string usuario)
        {
            return _databaseContext.Users.Any(u => u.Usuario == usuario);
        }

        public bool ExistsByEmail(string email)
        {
            return _databaseContext.Users.Any(u => u.Email == email);
        }

        public void AddUser(User entity)
        {
            _databaseContext.Users.Add(entity);
            _databaseContext.SaveChanges();
        }

        public void UpdateUser(User entity)
        {
            _databaseContext.Users.Update(entity);
            _databaseContext.SaveChanges();
        }

        public void SoftDeleteUser(User entity)
        {
            entity.Habilitado = !entity.Habilitado;
            _databaseContext.SaveChanges();
        }
        public void HardDeleteUser(User entity)
        {
            _databaseContext.Users.Remove(entity);
            _databaseContext.SaveChanges();
        }
    }
}
