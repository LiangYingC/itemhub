using Microsoft.AspNetCore.Mvc;
using Homo.Api;

namespace Homo.AuthApi
{
    [Route("v1/universal")]
    [SwaggerUiInvisibility]
    public class UniversalController : ControllerBase
    {

        public UniversalController()
        {
        }

        [HttpGet]
        [Route("firmware-types")]
        public ActionResult<dynamic> getFirmwareTypes()
        {
            return ConvertHelper.EnumToList(typeof(MICROCONTROLLER));
        }

        [HttpGet]
        [Route("social-media-types")]
        public ActionResult<dynamic> getSocialMediaTypes()
        {
            return ConvertHelper.EnumToList(typeof(SocialMediaProvider));
        }
    }
}
