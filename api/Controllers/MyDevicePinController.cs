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
            return DevicePinDataservice.GetAll(_dbContext, ownerId, new List<long>() { id }, null, null);
        }

        [HttpPost]
        public ActionResult<dynamic> batchedCreate([FromRoute] long id, [FromBody] List<DTOs.DevicePinsData> dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            DevicePinDataservice.BatchedCreate(_dbContext, id, ownerId, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpPatch]
        public ActionResult<dynamic> updatePins([FromRoute] long id, [FromBody] List<DTOs.DevicePinsData> dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            DevicePinDataservice.BatchedUpdate(_dbContext, id, ownerId, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpDelete]
        public ActionResult<dynamic> removeUnusedPins([FromRoute] long id, [FromQuery] string usedPins, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<string> pins = usedPins.Split(",").ToList<string>();
            DevicePinDataservice.RemoveUnusePins(_dbContext, ownerId, id, pins);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpPatch]
        [Route("{pin}")]
        public ActionResult<dynamic> updatePinName([FromRoute] long id, [FromRoute] string pin, [FromBody] DTOs.UpdateDevicePinName dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            DevicePinDataservice.UpdatePinName(_dbContext, ownerId, id, pin, dto.Name);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
