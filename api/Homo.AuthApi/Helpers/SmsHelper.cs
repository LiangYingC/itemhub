using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Homo.Core.Constants;

namespace Homo.AuthApi
{
    public class SmsHelper
    {
        public static async Task<SmsResult> Send(SmsProvider provider, string username, string password, string smsUrl, string phone, string message)
        {
            string url = smsUrl;
            HttpClient http = new HttpClient();
            string postBody = "";
            if (provider == SmsProvider.Mitake)
            {
                postBody = $"username={username}&password={password}&dstaddr={phone}&smbody={message}";
            }
            else if (provider == SmsProvider.Every8D)
            {
                postBody = $"UID={username}&PWD={password}&DEST={phone}&MSG={message}";
            }

            StringContent stringContent = new StringContent(postBody, System.Text.Encoding.UTF8, "application/x-www-form-urlencoded");
            HttpResponseMessage response = await http.PostAsync(url, stringContent);
            string result = "";
            using (var sr = new System.IO.StreamReader(await response.Content.ReadAsStreamAsync(), System.Text.Encoding.UTF8))
            {
                result = sr.ReadToEnd();
            }

            var smsResult = new SmsResult();
            smsResult.Raw = result;
            if (provider == SmsProvider.Mitake)
            {
                int msgIdStartIndex = result.IndexOf("msgid=");
                if (msgIdStartIndex == -1)
                {
                    // get error message 
                    int errorIndex = result.IndexOf("Error=");
                    string error = result.Substring(errorIndex, result.IndexOf("\r\n", errorIndex) - errorIndex).Replace("Error=", "");
                    throw new CustomException(ERROR_CODE.SMS_ERROR, System.Net.HttpStatusCode.InternalServerError, new Dictionary<string, string>() { { "message", error } });
                }
                string msgId = result.Substring(msgIdStartIndex, result.IndexOf("\r\n", msgIdStartIndex) - msgIdStartIndex).Replace("msgid=", "");
                smsResult.Id = msgId;

            }
            else if (provider == SmsProvider.Every8D)
            {
                List<string> resultList = result.Split(",").ToList<string>();
                int unsendCount = 0;
                int.TryParse(resultList[3], out unsendCount);
                if (unsendCount > 0)
                {
                    throw new CustomException(ERROR_CODE.SMS_ERROR, System.Net.HttpStatusCode.InternalServerError, new Dictionary<string, string>() { { "message", "insufficient credit" } });
                }
                smsResult.Id = resultList[4];
            }

            return smsResult;
        }
    }

    public enum SmsProvider
    {
        Every8D,
        Mitake
    }

    public class SmsResult
    {
        public string Id { get; set; }
        public string Raw { get; set; }

    }
}