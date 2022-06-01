using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.AuthApi
{
    [Route("v1/me")]
    [SwaggerUiInvisibility]
    [AuthorizeFactory]
    public class MeController : ControllerBase
    {

        private readonly DBContext _dbContext;
        public MeController(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [SwaggerOperation(
            Tags = new[] { "使用者相關" },
            Summary = "取得個人資訊",
            Description = ""
        )]
        [HttpGet]
        public dynamic getMe(DTOs.JwtExtraPayload extraPayload)
        {
            User user = UserDataservice.GetOne(_dbContext, extraPayload.Id);
            return new
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Profile = user.Profile,
                PseudonymousAddress = user.PseudonymousAddress,
                PseudonymousPhone = user.PseudonymousPhone
            };
        }
    }
}
