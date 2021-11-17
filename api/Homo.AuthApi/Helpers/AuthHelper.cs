using System.Collections.Generic;

namespace Homo.AuthApi
{
    public static class AuthHelper
    {
        public static Dictionary<string, string> GetDuplicatedUserType(User user)
        {
            Dictionary<string, string> duplicatedUserList = new Dictionary<string, string>();
            if (user.FacebookSub != null)
            {
                duplicatedUserList.Add("facebook", user.Email);
            }
            if (user.LineSub != null)
            {
                duplicatedUserList.Add("line", user.Email);
            }
            if (user.GoogleSub != null)
            {
                duplicatedUserList.Add("google", user.Email);
            }
            if (user.FacebookSub == null && user.LineSub == null && user.GoogleSub == null)
            {
                duplicatedUserList.Add("origin", user.Email);
            }
            return duplicatedUserList;
        }

        public static Microsoft.AspNetCore.Http.CookieOptions GetSecureCookieOptions()
        {
            return new Microsoft.AspNetCore.Http.CookieOptions() { HttpOnly = true, SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None, Secure = true };
        }
    }
}