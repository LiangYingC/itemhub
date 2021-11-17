using Microsoft.AspNetCore.Mvc;

namespace Homo.AuthApi
{
    [Route("v1/universal")]
    public class UniversalController : ControllerBase
    {

        public UniversalController()
        {
        }

        [HttpGet]
        [Route("social-media-types")]
        public ActionResult<dynamic> getSocialMediaTypes()
        {
            return ConvertHelper.EnumToList(typeof(SocialMediaProvider));
        }
    }
}
