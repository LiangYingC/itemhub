using Microsoft.AspNetCore.Mvc;
using Homo.AuthApi;
using Homo.Core.Constants;
using Homo.Core.Helpers;
using Homo.Api;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.IotApi
{
    [Route("v1/users")]
    [SwaggerUiInvisibility]
    public class UserController : ControllerBase
    {
        private readonly DBContext _dbContext;
        public UserController(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [SwaggerOperation(
            Tags = new[] { "Marketing" },
            Summary = "使用者數量",
            Description = ""
        )]
        [Route("number-of-registered-users")]
        [HttpGet]
        public ActionResult<dynamic> getNumberOfRegisteredUsers()
        {
            return new { nums = UserDataservice.GetRowNum(_dbContext, null, null) };
        }

        [SwaggerOperation(
            Tags = new[] { "Deprecated" },
            Summary = "早期使用者登記",
            Description = ""
        )]
        [Route("check-in")]
        [HttpPost]
        public ActionResult<dynamic> record([FromBody] DTOs.CheckIn dto)
        {
            User user = UserDataservice.GetOneByEmail(_dbContext, dto.Email);
            if (user != null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.EMAIL_ALREADY_REGISTERED, System.Net.HttpStatusCode.BadRequest);
            }

            string salt = CryptographicHelper.GetSalt(64);
            string hash = CryptographicHelper.GenerateSaltedHash(CryptographicHelper.GetSpecificLengthRandomString(32, true), salt);
            UserDataservice.SignUp(_dbContext, dto.Email, "", "", "", "", "", "", salt, hash);
            return new { Status = CUSTOM_RESPONSE.OK };
        }
    }
}