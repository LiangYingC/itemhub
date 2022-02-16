using System;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using Homo.Core.Constants;
using Homo.Core.Helpers;

namespace Homo.AuthApi
{
    [Route("v1/auth")]
    [Homo.Api.Validate]
    public class AuthVerifyEmailController : ControllerBase
    {
        private readonly Homo.Api.CommonLocalizer _commonLocalizer;
        private readonly DBContext _dbContext;
        private readonly string _verifyPhoneJwtKey;
        private readonly string _envName;
        private readonly string _sendGridAPIKey;
        private readonly string _systemEmail;
        private readonly string _websiteEndpoint;
        private readonly bool _authByCookie; public AuthVerifyEmailController(DBContext dbContext, IOptions<AppSettings> appSettings, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, Homo.Api.CommonLocalizer commonLocalizer)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _commonLocalizer = commonLocalizer;
            _verifyPhoneJwtKey = secrets.VerifyPhoneJwtKey;
            _dbContext = dbContext;
            _envName = env.EnvironmentName;
            _sendGridAPIKey = secrets.SendGridApiKey;
            _systemEmail = common.SystemEmail;
            _websiteEndpoint = common.WebSiteEndpoint;
        }


        [Route("send-verify-email")]
        [HttpPost]
        public async Task<dynamic> sendVerifyEmail([FromBody] DTOs.SendValidatedEmail dto)
        {
            string ip = NetworkHelper.GetIpFromRequest(Request);
            int countByIp = VerifyCodeDataservice.GetTodayCountByIp(_dbContext, ip);
            if (countByIp > 10)
            {
                throw new CustomException(ERROR_CODE.TOO_MANY_TIMES_TO_SEND_MAIL, HttpStatusCode.Forbidden);
            }

            int countByEmail = VerifyCodeDataservice.GetTodayCountByEmail(_dbContext, dto.Email);
            if (countByEmail > 10)
            {
                throw new CustomException(ERROR_CODE.TOO_MANY_TIMES_TO_SEND_MAIL, HttpStatusCode.Forbidden);
            }

            User user = UserDataservice.GetOneByEmail(_dbContext, dto.Email);
            List<string> duplicatedUserProvider = new List<string>();
            if (user != null)
            {
                throw new CustomException(ERROR_CODE.SIGN_IN_BY_OTHER_WAY, HttpStatusCode.BadRequest, null, new Dictionary<string, dynamic>(){
                            {"duplicatedUserProvider", AuthHelper.GetDuplicatedUserType(user)}
                        });
            }

            string code = CryptographicHelper.GetSpecificLengthRandomString(6, true, true);
            VerifyCodeDataservice.Create(_dbContext, new DTOs.VerifyCode()
            {
                Email = dto.Email,
                Code = code,
                Expiration = DateTime.Now.AddSeconds(3 * 60),
                Ip = ip
            });

            // await MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
            // {
            //     Subject = _commonLocalizer.Get("verify email"),
            //     Content = _commonLocalizer.Get("verify link", null, new Dictionary<string, string>() {
            //         { "link", $"{_websiteEndpoint}/sign-up/verify-email/" },
            //         { "code", code }
            //     })
            // }, _systemEmail, dto.Email, _sendGridAPIKey);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [Route("verify-email")]
        [HttpPost]
        public dynamic verifyEmail([FromBody] DTOs.VerifyEmail dto)
        {
            VerifyCode record = VerifyCodeDataservice.GetOneUnUsedByEmail(_dbContext, dto.Email, dto.Code);
            if (record == null)
            {
                throw new CustomException(ERROR_CODE.VERIFY_CODE_NOT_FOUND, HttpStatusCode.NotFound);
            }
            record.IsUsed = true;
            _dbContext.SaveChanges();
            return new { token = JWTHelper.GenerateToken(_verifyPhoneJwtKey, 5, new { email = record.Email }) };
        }

    }
}