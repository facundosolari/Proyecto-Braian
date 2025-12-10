using Application.Models.Request;
using Application.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserService
    {
        UserResponse? GetUserById(int id);
        List<UserResponse>? GetAllUsers();
        bool CreateUser(UserRequest request);
        /*
        bool UpdateUserAdmin(UserRequest request, int id);
        */
        bool UpdateUser(UserPatchRequest request, int id, int tokenUserId);
        /*
        bool SoftDeleteUser(int id);
        bool HardDeleteUser(int id);
        */

    }
}
