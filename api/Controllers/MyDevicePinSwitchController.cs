using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [Route("v1/my/devices/{id}/switches")]
    [IotDashboardAuthorizeFactory]
    [Validate]
    public class MyDeviceSwitchController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public MyDeviceSwitchController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getAll([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return DevicePinDataservice.GetAll(_dbContext, extraPayload.Id, new List<long>() { id }, DEVICE_MODE.SWITCH, null);
        }

        [HttpPost]
        public ActionResult<dynamic> create([FromRoute] long id, [FromBody] DTOs.DevicePin dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            DevicePin pin = DevicePinDataservice.GetOne(_dbContext, id, extraPayload.Id, dto.DeviceId, dto.Mode, dto.Pin);
            if (pin != null)
            {
                throw new CustomException(IotApi.ERROR_CODE.DEVICE_STATE_EXISTS, System.Net.HttpStatusCode.BadRequest);
            }
            return DevicePinDataservice.Create(_dbContext, extraPayload.Id, id, dto);
        }

        [HttpPatch]
        [Route("{pin}")]
        public ActionResult<dynamic> update([FromRoute] long id, [FromRoute] string pin, [FromBody] DTOs.DevicePinSwitchValue dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            DevicePinDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, id, pin, dto.Value);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
