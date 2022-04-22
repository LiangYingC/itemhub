using System.Threading.Tasks;
using System.Net;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Core.Constants;
using Homo.Core.Helpers;
using Homo.Api;
using System.Security.Claims;
using api.Constants;
using api.Helpers;

namespace Homo.AuthApi
{
    [Route("v1/auth")]
    [SwaggerUiInvisibility]
    public class AuthResetPasswordController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _resetPasswordJwtKey;
        private readonly CommonLocalizer _commonLocalizer;
        private readonly string _websiteUrl;
        private readonly string _systemEmail;
        private readonly string _sendGridApiKey;
        private readonly string _adminEmail;
        public AuthResetPasswordController(DBContext dbContext, IOptions<AppSettings> appSettings, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, Homo.Api.CommonLocalizer commonLocalizer)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _resetPasswordJwtKey = secrets.ResetPasswordJwtKey;
            _commonLocalizer = commonLocalizer;
            _websiteUrl = common.WebsiteUrl;
            _systemEmail = common.SystemEmail;
            _sendGridApiKey = secrets.SendGridApiKey;
            _dbContext = dbContext;
            _adminEmail = common.AdminEmail;
        }

        [Route("send-reset-password-mail")]
        [HttpPost]
        public async Task<dynamic> sendResetPasswordMail([FromBody] DTOs.SendResetPasswordMail dto)
        {
            User user = UserDataservice.GetOneByEmail(_dbContext, dto.Email, true);
            bool isEarlyBird = user != null && user.HashPhone == null;
            if (user == null)
            {
                throw new CustomException(ERROR_CODE.USER_NOT_FOUND, HttpStatusCode.NotFound);
            }
            if (!user.Status)
            {
                throw new CustomException(ERROR_CODE.USER_BE_BLOCKED, HttpStatusCode.Forbidden);
            }
            if (isEarlyBird)
            {
                throw new CustomException(ERROR_CODE.LACK_PHONE, HttpStatusCode.Forbidden);
            }

            UserDataservice.SetUserToForgotPasswordState(_dbContext, user.Id);
            string resetPasswordToken = JWTHelper.GenerateToken(_resetPasswordJwtKey, 10, new { Id = user.Id });

            MailTemplate template = MailTemplateHelper.Get(MAIL_TEMPLATE.RESET_PASSWORD);
            template = MailTemplateHelper.ReplaceVariable(template, new
            {
                websiteUrl = _websiteUrl,
                adminEmail = _adminEmail,
                link = $"{_websiteUrl}/auth/reset-password/?token={resetPasswordToken}",
                hello = _commonLocalizer.Get("hello"),
                mailContentResetPaswordTitle = _commonLocalizer.Get("mailContentResetPaswordTitle"),
                mailContentResetPasswordBtn = _commonLocalizer.Get("mailContentResetPasswordBtn"),
                mailContentSystemAutoSendEmail = _commonLocalizer.Get("mailContentSystemAutoSendEmail")
            });

            await MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
            {
                Subject = _commonLocalizer.Get(template.Subject),
                Content = template.Content
            }, _systemEmail, dto.Email, _sendGridApiKey);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [Route("reset-password")]
        [HttpPost]
        public dynamic resetPassword([FromBody] DTOs.ResetPassword dto)
        {
            ClaimsPrincipal payload = JWTHelper.GetPayload(_resetPasswordJwtKey, dto.Token);
            if (payload == null)
            {
                throw new CustomException(ERROR_CODE.VERIFY_RESET_PASSWORD_TOKEN_EXPIRED, HttpStatusCode.BadRequest);
            }

            var extraPayload = Newtonsoft.Json.JsonConvert.DeserializeObject<DTOs.JwtExtraPayload>(payload.FindFirstValue("extra"));

            long userId = (long)extraPayload.Id;
            User user = UserDataservice.GetOne(_dbContext, userId, true);
            string salt = CryptographicHelper.GetSalt(64);
            string hash = CryptographicHelper.GenerateSaltedHash(dto.Password, salt);
            UserDataservice.ResetPassword(_dbContext, userId, salt, hash);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}