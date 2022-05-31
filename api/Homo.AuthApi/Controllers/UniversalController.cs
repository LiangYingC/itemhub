using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.AuthApi
{
    [Route("v1/universal")]
    [SwaggerUiInvisibility]
    public class UniversalController : ControllerBase
    {

        public UniversalController()
        {
        }

        [SwaggerOperation(
            Tags = new[] { "常數" },
            Summary = "社群媒體",
            Description = ""
        )]
        [HttpGet]
        [Route("social-media-types")]
        public ActionResult<dynamic> getSocialMediaTypes()
        {
            return ConvertHelper.EnumToList(typeof(SocialMediaProvider));
        }
    }
}
