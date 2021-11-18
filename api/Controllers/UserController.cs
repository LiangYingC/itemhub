using Microsoft.AspNetCore.Mvc;
using Homo.AuthApi;

namespace Homo.IotApi
{
    [Route("v1/users")]
    public class UserController : ControllerBase
    {
        private readonly DBContext _dbContext;
        public UserController(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("number-of-registered-users")]
        public ActionResult<dynamic> getNumberOfRegisteredUsers()
        {
            return new { nums = UserDataservice.GetRowNums(_dbContext, null, null) };
        }
    }
}