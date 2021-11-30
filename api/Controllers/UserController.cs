using Microsoft.AspNetCore.Mvc;
using Homo.AuthApi;
using Homo.Core.Constants;
using Homo.Core.Helpers;

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

        [HttpPost]
        [Route("check-in")]
        public ActionResult<dynamic> record([FromBody] DTOs.CheckIn dto)
        {
            string salt = CryptographicHelper.GetSalt(64);
            string hash = CryptographicHelper.GenerateSaltedHash(CryptographicHelper.GetSpecificLengthRandomString(32, true), salt);
            UserDataservice.SignUp(_dbContext, dto.Email, "", "", "", salt, hash);
            return new { Status = CUSTOM_RESPONSE.OK };
        }
    }
}