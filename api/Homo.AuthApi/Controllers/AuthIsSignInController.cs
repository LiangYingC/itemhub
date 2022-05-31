using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.AuthApi
{
    [Route("v1/auth")]
    public class AuthIsSignInController : ControllerBase
    {
        private readonly string _jwtKey;
        private readonly bool _authByCookie;
        public AuthIsSignInController(IOptions<AppSettings> appSettings)
        {
            Secrets secrets = (Secrets)appSettings.Value.Secrets;
            Common common = (Common)appSettings.Value.Common;
            _jwtKey = secrets.JwtKey;
            _authByCookie = common.AuthByCookie;
        }

        [SwaggerOperation(
            Tags = new[] { "身份驗證" },
            Summary = "檢查是否登入",
            Description = ""
        )]
        [Route("is-sign-in")]
        [SwaggerUiInvisibility]
        [HttpPost]
        public dynamic isSignIn()
        {
            string token = null;
            bool result = false;
            if (_authByCookie)
            {
                HttpContext.Request.Cookies.TryGetValue("token", out token);
            }
            else
            {
                string authorization = Request.Headers["Authorization"];
                token = authorization.Substring("Bearer ".Length).Trim();
            }

            if (JWTHelper.isExpired(token))
            {
                return new { state = false };
            }

            dynamic extra = JWTHelper.GetExtraPayload(_jwtKey, token);
            if (extra != null)
            {
                result = true;
            }

            return new { state = result };
        }
    }
}