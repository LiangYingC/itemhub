using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Homo.AuthApi
{
    public enum SocialMediaProvider
    {
        FACEBOOK,
        LINE,
        GOOGLE
    }

    public class FacebookOAuthHelper
    {
        public static async Task<oAuthResp> GetAccessToken(string appId, string redirectURI, string clientSecret, string code)
        {
            string fbVerifyUserURL = $"https://graph.facebook.com/v5.0/oauth/access_token?client_id={appId}&redirect_uri={redirectURI}&client_secret={clientSecret}&code={code}";
            HttpClient http = new HttpClient();
            HttpResponseMessage response = await http.GetAsync(fbVerifyUserURL);
            string result = await response.Content.ReadAsStringAsync();
            var authObj = JsonConvert.DeserializeObject<JObject>(result);
            http.Dispose();
            if (authObj.ContainsKey("access_token"))
            {
                return JsonConvert.DeserializeObject<oAuthResp>(result);
            }
            else
            {
                throw new System.Exception(result);
            }
        }

        public static async Task<UserInfo> GetUserInfo(string accessToken)
        {
            HttpClient http = new HttpClient();
            HttpResponseMessage responseOfUserInfo = await http.GetAsync($"https://graph.facebook.com/v5.0/me?fields=id,name,email,picture&access_token={accessToken}");
            string resultOfUserInfo = await responseOfUserInfo.Content.ReadAsStringAsync();
            FacebookUserInfo fbUserInfo = JsonConvert.DeserializeObject<FacebookUserInfo>(resultOfUserInfo);
            return new UserInfo()
            {
                sub = fbUserInfo.id,
                email = fbUserInfo.email,
                name = fbUserInfo.name,
                picture = fbUserInfo.picture.data.url
            };
        }
    }

    public class LineOAuthHelper
    {
        public static async Task<oAuthResp> GetAccessToken(string clientId, string redirectURI, string clientSecret, string code)
        {
            string accessTokenEndPoint = $"https://api.line.me/oauth2/v2.1/token";
            HttpClient http = new HttpClient();
            string postBody = $"code={code}&client_id={clientId}&client_secret={clientSecret}&redirect_uri={redirectURI}&grant_type=authorization_code";
            StringContent stringContent = new StringContent(postBody, System.Text.Encoding.UTF8, "application/x-www-form-urlencoded");
            HttpResponseMessage response = await http.PostAsync(accessTokenEndPoint, stringContent);
            string result = await response.Content.ReadAsStringAsync();
            var authObj = JsonConvert.DeserializeObject<JObject>(result);
            if (authObj.ContainsKey("access_token"))
            {
                return JsonConvert.DeserializeObject<oAuthResp>(result);
            }
            else
            {
                throw new System.Exception(result);
            }
        }

        public static UserInfo GetUserInfo(string idToken)
        {
            return JWTHelper.DecodeToken<UserInfo>(idToken);
        }

    }

    public class GoogleOAuthHelper
    {
        public static async Task<oAuthResp> GetAccessToken(string clientId, string redirectURI, string clientSecret, string code)
        {
            string accessTokenEndPoint = $"https://oauth2.googleapis.com/token";
            HttpClient http = new HttpClient();
            dynamic postBody = new
            {
                code = code,
                client_id = clientId,
                client_secret = clientSecret,
                redirect_uri = redirectURI,
                grant_type = "authorization_code"
            };
            StringContent stringContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(postBody), System.Text.Encoding.UTF8, "application/json");
            HttpResponseMessage response = await http.PostAsync(accessTokenEndPoint, stringContent);
            string result = await response.Content.ReadAsStringAsync();
            var authObj = JsonConvert.DeserializeObject<JObject>(result);
            http.Dispose();
            if (authObj.ContainsKey("access_token"))
            {
                return JsonConvert.DeserializeObject<oAuthResp>(result);
            }
            else
            {
                throw new System.Exception(result);
            }
        }

        public static async Task<UserInfo> GetUserInfo(string accessToken)
        {
            HttpClient http = new HttpClient();
            HttpResponseMessage responseOfUserInfo = await http.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={accessToken}");
            string resultOfUserInfo = await responseOfUserInfo.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<UserInfo>(resultOfUserInfo);
        }
    }

    public class FacebookUserInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public FacebookPicture picture { get; set; }
    }

    public class FacebookPicture
    {
        public FacebookPictureData data { get; set; }
    }

    public class FacebookPictureData
    {
        public int height { get; set; }
        public int widt { get; set; }
        public string url { get; set; }
    }

    public class UserInfo
    {
        public string sub { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string picture { get; set; }
    }

    public class oAuthResp
    {
        public string access_token { get; set; }
        public string expires_in { get; set; }
        public string id_token { get; set; }
    }
}
