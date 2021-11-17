using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Core.Constants;
using Homo.Core.Helpers;
using Homo.Api;

namespace Homo.AuthApi
{
    [Route("v1/me")]
    [AuthorizeFactory]
    public class MeVerifyPhoneController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _smsUsername;
        private readonly string _smsPassword;
        private readonly string _smsClientUrl;
        private readonly string _pkcs1PublicKeyPath;
        private readonly CommonLocalizer _commonLocalizer;

        public MeVerifyPhoneController(DBContext dbContext, IOptions<AppSettings> appSettings, CommonLocalizer localizer)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _dbContext = dbContext;
            _smsUsername = secrets.SmsUsername;
            _smsPassword = secrets.SmsPassword;
            _smsClientUrl = common.SmsClientUrl;
            _pkcs1PublicKeyPath = common.Pkcs1PublicKeyPath;
            _commonLocalizer = localizer;
        }

        [HttpPost]
        [Route("send-sms")]
        public async Task<dynamic> sendSms([FromBody] DTOs.SendSms dto, DTOs.JwtExtraPayload extraPayload)
        {
            string code = CryptographicHelper.GetSpecificLengthRandomString(6, false, true);
            VerifyCodeDataservice.Create(_dbContext, new DTOs.VerifyCode()
            {
                Phone = dto.Phone,
                Code = code,
                Expiration = DateTime.Now.AddSeconds(3 * 60),
                Ip = NetworkHelper.GetIpFromRequest(Request)
            });
            string message = _commonLocalizer.Get("sms template", null, new Dictionary<string, string>() { { "code", code } });
            System.Console.WriteLine(_smsUsername);
            System.Console.WriteLine(_smsPassword);
            System.Console.WriteLine(_smsClientUrl);
            await SmsHelper.Send(_smsUsername, _smsPassword, _smsClientUrl, dto.Phone, message);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpPost]
        [Route("verify-phone")]
        public ActionResult<dynamic> verifyPhone([FromBody] DTOs.VerifyPhone dto, DTOs.JwtExtraPayload extraPayload)
        {
            VerifyCode record = VerifyCodeDataservice.GetOneUnUsedByPhone(_dbContext, dto.Phone, dto.Code);
            if (record == null)
            {
                throw new CustomException(ERROR_CODE.VERIFY_CODE_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            string encryptPhone = CryptographicHelper.GetRSAEncryptResult(_pkcs1PublicKeyPath, dto.Phone);
            string pseudonymousPhone = CryptographicHelper.GetHiddenString(dto.Phone, 2, 2);
            UserDataservice.UpdatePhone(_dbContext, extraPayload.Id, encryptPhone, pseudonymousPhone, extraPayload.Id);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
