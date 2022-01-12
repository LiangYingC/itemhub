using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/me/devices/{id}")]
    [Validate]
    public class MyDeviceStateDataController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public MyDeviceStateDataController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Route("{pin}")]
        public ActionResult<dynamic> create([FromRoute] long id, [FromRoute] string pin, [FromBody] DTOs.DevicePinData dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {

            DevicePinDataDataservice.Create(_dbContext, extraPayload.Id, id, pin, dto);
            List<Trigger> triggers = TriggerDataservice.GetAll(_dbContext, extraPayload.Id, id, pin);
            triggers.ForEach(trigger =>
            {
                if (trigger.Operator == (byte)TRIGGER_OPERATOR.B && dto.Value > trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceTargetState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.B && dto.Value <= trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceSourceState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.BE && dto.Value >= trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceTargetState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.BE && dto.Value < trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceSourceState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.L && dto.Value < trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceTargetState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.L && dto.Value >= trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceSourceState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.LE && dto.Value <= trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceTargetState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.LE && dto.Value > trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceSourceState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.E && dto.Value == trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceTargetState);
                }
                else if (trigger.Operator == (byte)TRIGGER_OPERATOR.E && dto.Value != trigger.SourceThreshold)
                {
                    DevicePinStateDataservice.UpdateValueByDeviceId(_dbContext, extraPayload.Id, trigger.DestinationDeviceId, trigger.DestinationPin, trigger.DestinationDeviceSourceState);
                }
            });
            return new { status = CUSTOM_RESPONSE.OK };
        }


        [HttpGet]
        [Route("{pin}")]
        public ActionResult<dynamic> getList([FromRoute] long id, [FromRoute] string pin, [FromQuery] int page, [FromQuery] int limit, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return DevicePinDataDataservice.GetList(_dbContext, extraPayload.Id, new List<long>() { id }, (byte)DEVICE_MODE.SENSOR, pin, page, limit);
        }
    }
}
