using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.Core.Constants;
using System.Linq;


namespace Homo.IotApi
{
    [Route("v1/my/devices/{id}/pins")]
    [IotDashboardAuthorizeFactory]
    [Validate]
    public class MyDevicePinController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
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

        [HttpPatch]
        [Route("{pin}")]
        public ActionResult<dynamic> updatePinName([FromRoute] long id, [FromRoute] string pin, [FromBody] DTOs.DevicePinName dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            DevicePinDataservice.UpdatePinName(_dbContext, ownerId, id, pin, dto.Name);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
