using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System;
using System.Text;
using Homo.Core.Constants;
using Homo.Core.Helpers;

namespace Homo.AuthApi
{


    [Route("v1/auth/fb-sub")]
    public class AuthRemoveFbSubController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _fbClientSecret;
        private readonly string _frontEndUrl;
        public AuthRemoveFbSubController(DBContext dbContext, IOptions<AppSettings> appSettings, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _fbClientSecret = secrets.FbClientSecret;
            _frontEndUrl = common.WebSiteEndpoint;
            _dbContext = dbContext;
        }
        [HttpGet]
        public ActionResult<dynamic> tracking([FromQuery] string confirmCode)
        {
            User user = UserDataservice.GetOneByConfirmCode(confirmCode, _dbContext);
            if (user.FacebookSub == null || user.FacebookSub == "")
            {
                return new
                {
                    status = "DONE"
                };
            }
            return new
            {
                status = "PROCESSING"
            };
        }

        [HttpPost]
        [Consumes("application/x-www-form-urlencoded")]
        public ActionResult<dynamic> removeFbSub([FromForm] DTOs.RemoveFbSub dto)
        {
            string[] raw = dto.signed_request.Split(".");
            if (raw.Length < 2)
            {
                throw new CustomException(ERROR_CODE.REMOVE_FB_SUB_INVALID_CODE, System.Net.HttpStatusCode.Forbidden);
            }
            string encodedPayload = raw[1].Replace('-', '+').Replace('_', '/').PadRight(4 * ((raw[1].Length + 3) / 4), '=');
            byte[] dataOfPayload = System.Convert.FromBase64String(encodedPayload);
            string payload = Encoding.UTF8.GetString(dataOfPayload);
            string encodedSign = raw[0].Replace('-', '+').Replace('_', '/').PadRight(4 * ((raw[0].Length + 3) / 4), '=');
            byte[] dataOfSign = System.Convert.FromBase64String(encodedSign);
            string sign = Encoding.UTF8.GetString(dataOfSign);

            Byte[] keyBytes = Encoding.UTF8.GetBytes(_fbClientSecret);
            HMACSHA256 sha256Hash = new HMACSHA256(keyBytes);
            byte[] data = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(raw[1]));
            string expectedSign = Encoding.UTF8.GetString(data);
            if (expectedSign != sign)
            {
                throw new CustomException(ERROR_CODE.REMOVE_FB_SUB_INVALID_CODE, System.Net.HttpStatusCode.Forbidden);
            }
            FbRemoveSubSign payloadObject = Newtonsoft.Json.JsonConvert.DeserializeObject<FbRemoveSubSign>(payload);
            string confirmCode = CryptographicHelper.GetRandomNumber(32);
            UserDataservice.RemoveFbSub(_dbContext, payloadObject.user_id, confirmCode);
            return new
            {
                url = $"{_frontEndUrl}api/v1/auth/fb-sub?confirmCode={confirmCode}",
                confirmation_code = confirmCode
            };
        }
    }
    public class FbRemoveSubSign
    {
        public string user_id { get; set; }
        public string algorithm { get; set; }
        public long issued_at { get; set; }
    }
}