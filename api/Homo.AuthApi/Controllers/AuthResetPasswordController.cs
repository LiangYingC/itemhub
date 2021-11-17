using System.Threading.Tasks;
using System.Net;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Core.Constants;
using Homo.Core.Helpers;
using Homo.Api;

namespace Homo.AuthApi
{
    [Route("v1/auth")]
    public class AuthResetPasswordController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _resetPasswordJwtKey;
        private readonly CommonLocalizer _commonLocalizer;
        private readonly string _websiteEndpoint;
        private readonly string _systemEmail;
        private readonly string _sendGridApiKey;
        public AuthResetPasswordController(DBContext dbContext, IOptions<AppSettings> appSettings, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, Homo.Api.CommonLocalizer commonLocalizer)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _resetPasswordJwtKey = secrets.ResetPasswordJwtKey;
            _commonLocalizer = commonLocalizer;
            _websiteEndpoint = common.WebSiteEndpoint;
            _systemEmail = common.SystemEmail;
            _sendGridApiKey = secrets.SendGridApiKey;
            _dbContext = dbContext;
        }

        [Route("send-reset-password-link")]
        [HttpPost]
        public async Task<dynamic> sendResetPasswordLink([FromBody] DTOs.SendResetPasswordLink dto)
        {
            User user = UserDataservice.GetOneByEmail(_dbContext, dto.Email, true);
            if (user == null)
            {
                throw new CustomException(ERROR_CODE.USER_NOT_FOUND, HttpStatusCode.NotFound);
            }
            UserDataservice.SetUserToForgotPasswordState(_dbContext, user.Id);
            string resetPasswordToken = JWTHelper.GenerateToken(_resetPasswordJwtKey, 10, new { Id = user.Id });
            await MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
            {
                Subject = _commonLocalizer.Get("reset email"),
                Content = _commonLocalizer.Get("reset link", null, new Dictionary<string, string>() {
                    { "link", $"{_websiteEndpoint}/auth/reset-password?token={resetPasswordToken}" }
                })
            }, _systemEmail, dto.Email, _sendGridApiKey);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [Route("reset-password")]
        [HttpPost]
        public dynamic resetPassword([FromBody] DTOs.ResetPassword dto)
        {
            var extraPayload = JWTHelper.GetExtraPayload(_resetPasswordJwtKey, dto.Token);
            long userId = (long)extraPayload.Id;
            System.Console.WriteLine(userId);
            User user = UserDataservice.GetOne(_dbContext, userId, true);
            string salt = CryptographicHelper.GetSalt(64);
            string hash = CryptographicHelper.GenerateSaltedHash(dto.Password, salt);
            UserDataservice.ResetPassword(_dbContext, userId, salt, hash);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}