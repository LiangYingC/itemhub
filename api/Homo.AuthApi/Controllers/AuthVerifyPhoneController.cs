using System;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

using Homo.Core.Constants;
using Homo.Core.Helpers;
using Homo.Api;

namespace Homo.AuthApi
{
    [Route("v1/auth")]
    [SwaggerUiInvisibility]
    [Homo.Api.Validate]

    public class AuthVerifyPhoneController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _smsUsername;
        private readonly string _smsPassword;
        private readonly string _smsClientUrl;
        private readonly string _pkcs1PublicKeyPath;
        private readonly string _signUpJwtKey;
        private readonly string _verifyPhoneJwtKey;
        private readonly string _phoneHashSalt;
        private readonly CommonLocalizer _commonLocalizer;

        public AuthVerifyPhoneController(DBContext dbContext, IOptions<AppSettings> appSettings, CommonLocalizer localizer)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _dbContext = dbContext;
            _smsUsername = secrets.SmsUsername;
            _smsPassword = secrets.SmsPassword;
            _smsClientUrl = common.SmsClientUrl;
            _signUpJwtKey = secrets.SignUpJwtKey;
            _verifyPhoneJwtKey = secrets.VerifyPhoneJwtKey;
            _pkcs1PublicKeyPath = common.Pkcs1PublicKeyPath;
            _commonLocalizer = localizer;
            _phoneHashSalt = secrets.PhoneHashSalt;
        }

        [SwaggerOperation(
            Tags = new[] { "註冊相關" },
            Summary = "寄送驗證簡訊",
            Description = ""
        )]
        [Route("send-sms")]
        [HttpPost]
        public async Task<dynamic> sendSms([FromBody] DTOs.SendSms dto, DTOs.JwtExtraPayload extraPayload)
        {
            string ip = NetworkHelper.GetIpFromRequest(Request);
            int countByIp = VerifyCodeDataservice.GetTodayCountByIp(_dbContext, ip);
            if (countByIp > 10)
            {
                throw new CustomException(ERROR_CODE.TOO_MANY_TIMES_TO_SEND_PHONE, HttpStatusCode.Forbidden);
            }

            string hashPhone = CryptographicHelper.GenerateSaltedHash(dto.Phone, _phoneHashSalt);
            User user = UserDataservice.GetOneByHashPhone(_dbContext, hashPhone);
            if (user != null)
            {
                throw new CustomException(ERROR_CODE.DUPLICATED_PHONE, HttpStatusCode.BadRequest);
            }

            int countByPhone = VerifyCodeDataservice.GetTodayCountByPhone(_dbContext, dto.Phone);
            if (countByPhone > 10)
            {
                throw new CustomException(ERROR_CODE.TOO_MANY_TIMES_TO_SEND_PHONE, HttpStatusCode.Forbidden);
            }

            string code = CryptographicHelper.GetSpecificLengthRandomString(6, false, true);
            VerifyCodeDataservice.Create(_dbContext, new DTOs.VerifyCode()
            {
                Phone = dto.Phone,
                Code = code,
                Expiration = DateTime.Now.AddSeconds(3 * 60),
                Ip = NetworkHelper.GetIpFromRequest(Request)
            });

            string message = _commonLocalizer.Get("sms template", null, new Dictionary<string, string>() { { "code", code } });
            await SmsHelper.Send(SmsProvider.Every8D, _smsUsername, _smsPassword, _smsClientUrl, dto.Phone, message);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "註冊相關" },
            Summary = "驗證手機",
            Description = ""
        )]
        [HttpPost]
        [Route("verify-phone")]
        public ActionResult<dynamic> verifyPhone([FromBody] DTOs.VerifyPhone dto)
        {
            var payload = JWTHelper.GetPayload(_verifyPhoneJwtKey, dto.VerifyPhoneToken);
            if (payload == null)
            {
                throw new CustomException(ERROR_CODE.VERIFY_PHONE_TOKEN_EXPIRED, HttpStatusCode.BadRequest);
            }

            var extraPayload = JsonConvert.DeserializeObject<dynamic>(payload.FindFirstValue("extra"));

            VerifyCode record = VerifyCodeDataservice.GetOneUnUsedByPhone(_dbContext, dto.Phone, dto.Code);
            if (record == null)
            {
                throw new CustomException(ERROR_CODE.VERIFY_CODE_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            record.IsUsed = true;
            _dbContext.SaveChanges();

            return new { token = JWTHelper.GenerateToken(_signUpJwtKey, 5, new { Email = extraPayload.Email.Value, Phone = dto.Phone }) };
        }
    }
}
