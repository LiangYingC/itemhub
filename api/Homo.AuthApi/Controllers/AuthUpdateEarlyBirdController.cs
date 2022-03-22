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
    public class AuthUpdateEarlyBirdController : ControllerBase
    {
        private readonly Homo.Api.CommonLocalizer _commonLocalizer;
        private readonly DBContext _dbContext;
        private readonly string _jwtKey;
        private readonly string _dashboardJwtKey;
        private readonly string _signUpJwtKey;
        private readonly string _verifyPhoneJwtKey;
        private readonly int _jwtExpirationMonth;
        private readonly string _envName;
        private readonly string _sendGridAPIKey;
        private readonly string _systemEmail;
        private readonly string _websiteEndpoint;
        private readonly bool _authByCookie;
        private readonly string _PKCS1PublicKeyPath;
        private readonly string _phoneHashSalt;
        public AuthUpdateEarlyBirdController(DBContext dbContext, IOptions<AppSettings> appSettings, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, Homo.Api.CommonLocalizer commonLocalizer)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _commonLocalizer = commonLocalizer;
            _jwtKey = secrets.JwtKey;
            _dashboardJwtKey = secrets.DashboardJwtKey;
            _jwtExpirationMonth = common.JwtExpirationMonth;
            _signUpJwtKey = secrets.SignUpJwtKey;
            _verifyPhoneJwtKey = secrets.VerifyPhoneJwtKey;
            _dbContext = dbContext;
            _envName = env.EnvironmentName;
            _sendGridAPIKey = secrets.SendGridApiKey;
            _systemEmail = common.SystemEmail;
            _websiteEndpoint = common.WebSiteEndpoint;
            _authByCookie = common.AuthByCookie;
            _PKCS1PublicKeyPath = common.Pkcs1PublicKeyPath;
            _phoneHashSalt = secrets.PhoneHashSalt;
        }

        [Route("early-bird-binding")]
        [AuthorizeFactory(AUTH_TYPE.SIGN_UP)]
        [HttpPost]
        public ActionResult<dynamic> signUp([FromBody] DTOs.SignUp dto, DTOs.JwtExtraPayload extraPayload)
        {
            System.Console.WriteLine($"early-bird-binding:{Newtonsoft.Json.JsonConvert.SerializeObject(extraPayload, Newtonsoft.Json.Formatting.Indented)}");
            User user = UserDataservice.GetOneByEmail(_dbContext, extraPayload.Email, true);
            if (user == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }

            string pseudoPhone = CryptographicHelper.GetHiddenString(extraPayload.Phone, 2, 2);
            string encryptPhone = CryptographicHelper.GetRSAEncryptResult(_PKCS1PublicKeyPath, extraPayload.Phone);
            string hashPhone = CryptographicHelper.GenerateSaltedHash(extraPayload.Phone, _phoneHashSalt);
            string salt = CryptographicHelper.GetSalt(64);
            string hash = CryptographicHelper.GenerateSaltedHash(dto.Password, salt);

            UserDataservice.UpdateEarlyBird(_dbContext, user.Id, encryptPhone, pseudoPhone, hashPhone, salt, hash);

            var userPayload = new DTOs.JwtExtraPayload()
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                County = user.County,
                City = user.City,
                FacebookSub = user.FacebookSub,
                GoogleSub = user.GoogleSub,
                LineSub = user.LineSub,
                Profile = user.Profile,
                PseudonymousPhone = pseudoPhone,
                PseudonymousAddress = user.PseudonymousAddress
            };

            List<ViewRelationOfGroupAndUser> permissions = RelationOfGroupAndUserDataservice.GetRelationByUserId(_dbContext, extraPayload.Id);
            string[] roles = permissions.SelectMany(x => Newtonsoft.Json.JsonConvert.DeserializeObject<string[]>(x.Roles)).ToArray();

            string token = JWTHelper.GenerateToken(_jwtKey, _jwtExpirationMonth * 30 * 24 * 60, userPayload);
            string dashboardToken = JWTHelper.GenerateToken(_dashboardJwtKey, _jwtExpirationMonth * 3 * 24 * 60, userPayload);

            if (_authByCookie)
            {
                Response.Cookies.Append("token", token, AuthHelper.GetSecureCookieOptions());
                Response.Cookies.Append("dashboardToken", dashboardToken, AuthHelper.GetSecureCookieOptions());
            }
            else
            {
                return new
                {
                    Token = token,
                    DashboardToken = dashboardToken
                };
            }

            return userPayload;
        }

    }
}