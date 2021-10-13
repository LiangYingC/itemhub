using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Core.Helpers;
using Homo.Core.Constants;
using Homo.AuthApi;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Homo.IotApi
{
    [Route("v1/oauth")]
    public class OauthController : ControllerBase
    {
        private readonly IotDbContext _iotDbContext;
        private readonly DBContext _dbContext;
        private readonly string _jwtKey;
        private readonly string _refreshJwtKey;
        public OauthController(IotDbContext iotDbContext, DBContext dbContext, IOptions<AppSettings> optionAppSettings)
        {
            _iotDbContext = iotDbContext;
            _dbContext = dbContext;
            AppSettings settings = optionAppSettings.Value;
            _jwtKey = settings.Secrets.JwtKey;
            _refreshJwtKey = settings.Secrets.RefreshJwtKey;
        }

        [HttpGet]
        public ActionResult<dynamic> getCode([FromQuery(Name = "redirect_uri")] string redirectUri, [FromQuery] string state, [FromQuery(Name = "response_type")] string responseType, [FromQuery(Name = "client_id")] string clientId)
        {
            if (responseType != "code")
            {
                throw new CustomException(ERROR_CODE.OAUTH_TYPE_ONLY_SUPPORT_CODE, System.Net.HttpStatusCode.BadRequest);
            }
            var oauthClient = OauthClientDataservice.GetOneByClientId(_iotDbContext, clientId);
            if (oauthClient == null)
            {
                throw new CustomException(ERROR_CODE.OAUTH_CLIENT_ID_NOT_FOUND, System.Net.HttpStatusCode.BadRequest);
            }
            var oauthClientRedirectUri = OauthClientRedirectUriDataservice.GetOneByRedirectUri(_iotDbContext, oauthClient.OwnerId, redirectUri);
            if (oauthClientRedirectUri == null)
            {
                throw new CustomException(ERROR_CODE.OAUTH_REDIRECT_URI_NOT_IN_WHITLIST, System.Net.HttpStatusCode.BadRequest);
            }

            string randomCode = CryptographicHelper.GetSpecificLengthRandomString(20, true, false);
            OauthCodeDataservice.Create(_iotDbContext, new DTOs.OauthCode() { Code = randomCode, ExpiredAt = System.DateTime.Now.AddSeconds(60), ClientId = clientId });
            Response.Redirect($"{redirectUri}?code={randomCode}&state={state}");
            Response.StatusCode = (int)System.Net.HttpStatusCode.Redirect;
            return new { code = randomCode };
        }

        [Route("token")]
        [HttpPost]
        [Consumes("application/x-www-form-urlencoded")]
        public ActionResult<dynamic> auth([FromForm] DTOs.Oauth dto)
        {
            OauthClient oauthClient = null;
            int expirationMinutes = 3 * 30 * 24 * 60;
            if (dto.grant_type == "authorization_code")
            {
                if (dto == null)
                {
                    throw new CustomException(Homo.Api.ERROR_CODE.INVALID_FORM, System.Net.HttpStatusCode.BadRequest);
                }
                oauthClient = OauthClientDataservice.GetOneByClientId(_iotDbContext, dto.client_id);
                if (oauthClient == null)
                {
                    throw new CustomException(ERROR_CODE.OAUTH_CLIENT_ID_NOT_FOUND, System.Net.HttpStatusCode.BadRequest);
                }
                var oauthClientRedirectUri = OauthClientRedirectUriDataservice.GetOneByRedirectUri(_iotDbContext, oauthClient.OwnerId, dto.redirect_uri);
                if (oauthClientRedirectUri == null)
                {
                    throw new CustomException(ERROR_CODE.OAUTH_REDIRECT_URI_NOT_IN_WHITLIST, System.Net.HttpStatusCode.BadRequest);
                }
                var oauthClientCode = OauthCodeDataservice.GetOneByCode(_iotDbContext, dto.code);
                if (oauthClientCode.ExpiredAt <= DateTime.Now)
                {
                    throw new CustomException(ERROR_CODE.OAUTH_CODE_EXPIRED, System.Net.HttpStatusCode.BadRequest);
                }

                // make sure user authorized
                if (oauthClient.HashClientSecrets != CryptographicHelper.GenerateSaltedHash(dto.client_secret, oauthClient.Salt))
                {
                    throw new CustomException(Homo.AuthApi.ERROR_CODE.UNAUTH_ACCESS_API, System.Net.HttpStatusCode.Forbidden);
                }

                var expirationTime = DateTime.Now.ToUniversalTime().AddMinutes(expirationMinutes);
                Int32 unixTimestamp = (Int32)(expirationTime.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                User user = UserDataservice.GetOne(_dbContext, oauthClient.OwnerId);
                List<ViewRelationOfGroupAndUser> permissions = RelationOfGroupAndUserDataservice.GetRelationByUserId(_dbContext, user.Id);
                string[] roles = permissions.SelectMany(x => Newtonsoft.Json.JsonConvert.DeserializeObject<string[]>(x.Roles)).ToArray();
                var extraPayload = new Homo.AuthApi.DTOs.JwtExtraPayload()
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
                    PseudonymousPhone = user.PseudonymousPhone,
                    PseudonymousAddress = user.PseudonymousAddress
                };
                string accessToken = JWTHelper.GenerateToken(_jwtKey, expirationMinutes, extraPayload, roles);
                string refreshToken = JWTHelper.GenerateToken(_refreshJwtKey, 6 * 30 * 24 * 60, extraPayload, roles);
                return new
                {
                    token_type = "bearer",
                    access_token = accessToken,
                    refresh_token = refreshToken,
                    expires_in = unixTimestamp
                };
            }
            else if (dto.grant_type == "refresh_token")
            {
                string authorization = Request.Headers["Authorization"];
                string token = authorization == null ? "" : authorization.Substring("Bearer ".Length).Trim();
                Homo.AuthApi.DTOs.JwtExtraPayload refreshExtraPayload = JWTHelper.GetExtraPayload(_refreshJwtKey, token);
                ClaimsPrincipal payload = JWTHelper.GetPayload(_refreshJwtKey, token);
                if (refreshExtraPayload == null)
                {
                    throw new CustomException(Homo.AuthApi.ERROR_CODE.UNAUTH_ACCESS_API, System.Net.HttpStatusCode.Forbidden);
                }
                string accessToken = JWTHelper.GenerateToken(_jwtKey, expirationMinutes, refreshExtraPayload, new string[] { "testing" });
                var expirationTime = DateTime.Now.ToUniversalTime().AddMinutes(expirationMinutes);
                Int32 unixTimestamp = (Int32)(expirationTime.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                return new
                {
                    token_type = "bearer",
                    access_token = accessToken,
                    expires_in = unixTimestamp
                };
            }

            return new { };
        }
    }
}
