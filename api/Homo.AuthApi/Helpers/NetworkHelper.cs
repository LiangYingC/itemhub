using Microsoft.AspNetCore.Http;

namespace Homo.AuthApi
{
    public class NetworkHelper
    {
        public static string GetIpFromRequest(HttpRequest request)
        {
            string ip = request.Headers["X-Real-IP"];
            if (ip == null)
            {
                ip = request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            }
            return ip;
        }

    }
}
