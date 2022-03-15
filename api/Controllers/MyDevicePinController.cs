using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.Core.Constants;
using System.Linq;


namespace Homo.IotApi
{
    [IotDashboardAuthorizeFactory]
    [Route("v1/me/devices/{id}/pins")]
    [Validate]
    public class MyDevicePinController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;
        public MyDevicePinController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getAll([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            return DevicePinDataservice.GetList(_dbContext, ownerId, id);
        }

        [HttpDelete]
        public ActionResult<dynamic> removeUnusedPins([FromRoute] long id, [FromQuery] string usedPins, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<string> pins = usedPins.Split(",").ToList<string>();
            DevicePinDataservice.RemoveUnuseSwitchPins(_dbContext, ownerId, id, pins);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
