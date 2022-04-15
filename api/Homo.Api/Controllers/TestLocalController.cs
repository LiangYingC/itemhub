using Microsoft.AspNetCore.Mvc;
using Homo.Core.Constants;

namespace Homo.Api
{
    [Route("v1/localization")]
    [SwaggerUiInvisibility]
    public class TestLocalController
    {
        private CommonLocalizer _commonLocalizer;
        public TestLocalController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, CommonLocalizer commonLocalizer)
        {
            _commonLocalizer = commonLocalizer;
        }

        [HttpGet]
        [Route("common")]
        public dynamic testCommonLocalizer()
        {
            return new { message = _commonLocalizer.Get("hello") };
        }

        [HttpGet]
        [Route("error-middleware")]
        public dynamic testErrorMiddle()
        {
            throw new CustomException(ERROR_CODE.TEST, System.Net.HttpStatusCode.BadRequest);
        }
    }
}