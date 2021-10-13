using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/me/devices/{id}/states")]
    [Validate]
    public class MyDeviceStateController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public MyDeviceStateController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getStates([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return DeviceStateDataservice.GetAll(_dbContext, extraPayload.Id, new List<long>() { id }, null, null);
        }

        [HttpPost]
        public ActionResult<dynamic> createPinState([FromRoute] long id, [FromBody] DTOs.DeviceState dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            DeviceState state = DeviceStateDataservice.GetOne(_dbContext, id, dto.Mode, dto.Pin);
            if (state != null)
            {
                throw new CustomException(IotApi.ERROR_CODE.DEVICE_STATE_EXISTS, System.Net.HttpStatusCode.BadRequest);
            }
            return DeviceStateDataservice.Create(_dbContext, extraPayload.Id, id, dto);
        }

        [HttpPatch]
        [Route("{pin}")]
        public ActionResult<dynamic> updatePinState([FromRoute] long id, [FromRoute] string pin, [FromBody] DTOs.DeviceStateValue dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            DeviceStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, id, pin, dto.Value);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
