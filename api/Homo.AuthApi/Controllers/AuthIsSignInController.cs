using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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

        [Route("is-sign-in")]
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