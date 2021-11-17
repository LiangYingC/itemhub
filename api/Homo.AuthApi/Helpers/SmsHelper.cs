using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Homo.Core.Constants;

namespace Homo.AuthApi
{
    public class SmsHelper
    {
        public static async Task<dynamic> Send(string username, string password, string smsUrl, string phone, string message)
        {
            string url = smsUrl;
            HttpClient http = new HttpClient();
            string postBody = $"username={username}&password={password}&dstaddr={phone}&smbody={message}";
            StringContent stringContent = new StringContent(postBody, System.Text.Encoding.UTF8, "application/x-www-form-urlencoded");
            HttpResponseMessage response = await http.PostAsync(url, stringContent);
            string result = "";
            using (var sr = new System.IO.StreamReader(await response.Content.ReadAsStreamAsync(), System.Text.Encoding.UTF8))
            {
                result = sr.ReadToEnd();
            }
            // [1]
            // msgid=0008631797
            // statuscode=1
            // AccountPoint=1456421
            int msgIdStartIndex = result.IndexOf("msgid=");
            if (msgIdStartIndex == -1)
            {
                // get error message 
                int errorIndex = result.IndexOf("Error=");
                string error = result.Substring(errorIndex, result.IndexOf("\r\n", errorIndex) - errorIndex).Replace("Error=", "");
                throw new CustomException(ERROR_CODE.SMS_ERROR, System.Net.HttpStatusCode.InternalServerError, new Dictionary<string, string>() { { "message", error } });
            }

            string msgId = result.Substring(msgIdStartIndex, result.IndexOf("\r\n", msgIdStartIndex) - msgIdStartIndex).Replace("msgid=", "");
            return new { msgId = msgId, rawData = result };
        }
    }
}