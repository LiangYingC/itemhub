using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Core.Constants;
using Homo.Core.Helpers;

namespace Homo.AuthApi
{
    [Route("v1/auth")]
    [AuthorizeFactory()]
    public class AuthTwoFactorController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _jwtKey;
        private readonly string _dashboardJwtKey;
        private readonly string _systemEmail;
        private readonly string _sendGridApiKey;

        public AuthTwoFactorController(
            DBContext dbContext
            , IOptions<Homo.AuthApi.AppSettings> appSettings
        )
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            _jwtKey = secrets.JwtKey;
            _dashboardJwtKey = secrets.DashboardJwtKey;
            _dbContext = dbContext;
            _systemEmail = appSettings.Value.Common.SystemEmail;
            _sendGridApiKey = secrets.SendGridApiKey;
        }

        [Route("send-two-factor-auth-mail")]
        [HttpPost]
        public async Task<dynamic> sendTwoFactorAuthMail(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            User user = UserDataservice.GetOne(_dbContext, extraPayload.Id, true);

            if (user == null)
            {
                throw new CustomException(ERROR_CODE.USER_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }

            string verifyCode = CryptographicHelper.GetSpecificLengthRandomString(6, false, true);
            VerifyCodeDataservice.Create(_dbContext, new DTOs.VerifyCode()
            {
                Code = verifyCode,
                Email = user.Email,
                IsTwoFactorAuth = true,
                Expiration = System.DateTime.Now.AddMinutes(5)
            });

            await MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
            {
                Subject = "Itemhub - 兩階段驗證信",
                Content = $"驗證碼為: {verifyCode}"
            }, _systemEmail, user.Email, _sendGridApiKey); // 未來如果人多的時候就直接用 amazon ses 

            return new { status = CUSTOM_RESPONSE.OK };
        }

        [Route("exchange-dashboard-token")]
        [HttpPost]
        public ActionResult<dynamic> exhangeDashboardToken([FromBody] DTOs.VerifyCode dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            User user = UserDataservice.GetOne(_dbContext, extraPayload.Id);
            VerifyCode verifyCode = VerifyCodeDataservice.GetOneUnUsedByEmail(_dbContext, user.Email, dto.Code, true);

            if (verifyCode == null)
            {
                throw new CustomException(ERROR_CODE.VERIFY_CODE_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            VerifyCodeDataservice.UseVerifyCode(verifyCode, _dbContext);
            string token = JWTHelper.GenerateToken(_dashboardJwtKey, 3 * 24 * 60, extraPayload);
            return new { token = token };
        }
    }
}