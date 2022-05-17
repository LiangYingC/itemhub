using System;
using System.IO;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;

namespace Homo.IotApi
{
    [Route("v1/firmware")]
    [IotDashboardAuthorizeFactory]
    [SwaggerUiInvisibility]
    [Validate]
    public class FirmwareController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _staticPath;
        public FirmwareController(IotDbContext dbContext, IOptions<AppSettings> appSettings, Homo.Api.CommonLocalizer commonLocalizer)
        {
            _dbContext = dbContext;
            _staticPath = appSettings.Value.Common.StaticPath;
        }

        [HttpGet]
        [Route("{bundleId}")]
        public ActionResult<dynamic> get([FromRoute] string bundleId, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            FirmwareBundleLog log = FirmwareBundleLogDataservice.GetOneByBundleId(_dbContext, bundleId);

            if (log == null)
            {
                return NotFound();
            }

            Device device = DeviceDataservice.GetOne(_dbContext, extraPayload.Id, log.DeviceId);
            if (device == null)
            {
                return Forbid();
            }

            if (String.IsNullOrEmpty(log.Filename))
            {
                return NoContent();
            }

            Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
            var buffer = System.IO.File.ReadAllBytes($"{_staticPath}/firmware/{log.Filename}.zip");
            MemoryStream stream = new MemoryStream(buffer);
            stream.Seek(0, SeekOrigin.Begin);
            FileStreamResult result;
            result = new FileStreamResult(stream, new MediaTypeHeaderValue("application/zip"));
            result.FileDownloadName = $"{device.Name ?? bundleId}.zip";
            return result;
        }

    }
}
