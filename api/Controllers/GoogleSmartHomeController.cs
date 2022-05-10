using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Newtonsoft.Json;

namespace Homo.IotApi
{
    [IotDashboardAuthorizeFactory]
    [Route("v1/google-smart-home")]
    [Validate]
    public class GoogleSmartHomeController : ControllerBase
    {
        private readonly string GoogleDevicePin = "D0";
        private static List<DevicePinSwitch> DevicePinStates = new List<DevicePinSwitch>();
        private readonly IotDbContext _dbContext;
        public GoogleSmartHomeController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public ActionResult<dynamic> fulfillment([FromBody] DTOs.GoogleSmartHome dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            if (dto.Inputs[0].Intent == GOOGLE_SMART_HOME_INTENT.DEVICES_SYNC)
            {
                return onSync(dto, extraPayload);
            }
            else if (dto.Inputs[0].Intent == GOOGLE_SMART_HOME_INTENT.DEVICES_QUERY)
            {
                return onQuery(dto, extraPayload);
            }
            else if (dto.Inputs[0].Intent == GOOGLE_SMART_HOME_INTENT.DEVICES_EXECUTE)
            {
                return onExecute(dto, extraPayload);
            }
            return null;
        }

        private ActionResult<dynamic> onSync([FromBody] DTOs.GoogleSmartHome dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<DTOs.DevicePin> devicePins = DevicePinDataservice.GetAll(_dbContext, ownerId, null, null, null);
            List<DeviceInfo> deviceInfos = devicePins
                .Select(x =>
                {
                    return new DeviceInfo()
                    {
                        Name = new DeviceName() { Name = x.Name },
                        Id = $"{x.DeviceId}-{x.Pin}",
                        Traits = new List<string>() { "action.devices.traits.OnOff" },
                        Type = x.Mode == DEVICE_MODE.SENSOR ? "action.devices.types.SENSOR" :
                            x.Mode == DEVICE_MODE.SWITCH ? "action.devices.types.SWITCH" : "action.devices.types.SWITCH",
                        WillReportState = true
                    };
                })
                .ToList<DeviceInfo>();
            return new
            {
                RequestId = dto.RequestId,
                Payload = new
                {
                    AgentUserId = ownerId,
                    Devices = deviceInfos
                }
            };
        }

        private ActionResult<dynamic> onQuery([FromBody] DTOs.GoogleSmartHome dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<long> deviceIds = dto.Inputs[0].Payload.Devices.Select(x =>
            {
                string deviceId = x.Id.Split("-").ToList()[0];
                long longDeviceId = 0;
                long.TryParse(deviceId, out longDeviceId);
                return longDeviceId;
            }).ToList<long>();
            List<string> googleSmartHomeIds = dto.Inputs[0].Payload.Devices.Select(x => x.Id).ToList();
            List<Device> devices = DeviceDataservice.GetAllByIds(_dbContext, ownerId, deviceIds);
            List<DTOs.DevicePin> myDevicePins = DevicePinDataservice.GetAll(_dbContext, ownerId, deviceIds, null, null);

            return new
            {
                RequestId = dto.RequestId,
                Payload = new
                {
                    Devices = myDevicePins.Where(x =>
                    {
                        return googleSmartHomeIds.Where(y =>
                        {
                            List<string> arrayOfSplitString = y.Split("-").ToList();
                            long deviceId = 0;
                            string pin = arrayOfSplitString[1];
                            long.TryParse(arrayOfSplitString[0], out deviceId);
                            return x.DeviceId == deviceId && x.Pin == pin;
                        }).Count() > 0;
                    }).Select((x) =>
                    {
                        var device = devices.Where(device => device.Id == x.DeviceId).FirstOrDefault();
                        return new
                        {
                            DeviceId = $"{x.DeviceId}-{x.Pin}",
                            On = x.Value == 1,
                            Status = "SUCCESS",
                            Online = device == null ? false : device.Online,
                            CurrentSensorStateData = new List<dynamic>() {
                                new {
                                    Name = "Value",
                                    CurrentSensorState = x.Value
                                }
                            }
                        };
                    })
                    .Where(x => x != null)
                    .ToDictionary(x => x.DeviceId)
                }
            };
        }

        private ActionResult<dynamic> onExecute([FromBody] DTOs.GoogleSmartHome dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<DeviceCommand> commands = dto.Inputs[0].Payload.Commands;
            List<dynamic> commandResult = new List<dynamic>();
            commands.ForEach(command =>
            {
                for (int i = 0; i < command.Devices.Count; i++)
                {
                    DevicePinDataservice.UpdateValueByDeviceId(_dbContext, ownerId, command.Devices[i].Id, GoogleDevicePin, command.Execution[i].Params.on.Value ? 1 : 0);
                }
            });
            List<long> myDeviceIds = commands[0].Devices.Select(x => x.Id).ToList<long>();
            List<DTOs.DevicePin> states = DevicePinDataservice.GetAll(_dbContext, ownerId, myDeviceIds, DEVICE_MODE.SWITCH, this.GoogleDevicePin);
            List<Device> devices = DeviceDataservice.GetAllByIds(_dbContext, ownerId, states.Select(x => x.DeviceId).ToList<long>());
            List<GoogleDeviceState> statesForGoogle = states
            .Select(x => new GoogleDeviceState()
            {
                DeviceId = x.DeviceId,
                On = x.Value == 1,
                Status = "SUCCESS",
                Online = devices.Where(y => y.Id == x.DeviceId).FirstOrDefault().Online,
            }).ToList();

            return new
            {
                RequestId = dto.RequestId,
                Payload = new
                {
                    Commands = new List<dynamic>()
                    {
                        new {
                            Ids = myDeviceIds.Select(x=> x.ToString()).ToList<string>(),
                            Status = "SUCCESS",
                            States = statesForGoogle.Select(x=>new {
                                DeviceId = x.DeviceId.ToString(),
                                On = x.On,
                                Status = x.Status,
                                Online = x.Online,
                            }).ToList()
                        }
                    }

                }
            };
        }
    }

    public class DeviceCommand
    {
        public List<ExecuteDevice> Devices { get; set; }
        public List<DeviceExecution> Execution { get; set; }
    }

    public class ExecuteDevice
    {
        public long Id { get; set; }

    }

    public class DeviceExecution
    {
        public string Command { get; set; }
        public dynamic Params { get; set; }
    }

    public class DeviceInfo
    {
        public string Id { get; set; }
        public DeviceName Name { get; set; }
        public List<string> Traits { get; set; }
        public string Type { get; set; }
        public bool WillReportState { get; set; }
    }

    public class DeviceName
    {
        public List<string> DefaultNames { get; set; }
        public List<string> Nicknames { get; set; }
        public string Name { get; set; }
    }

    public class GoogleDeviceState
    {
        public long OwnerId { get; set; }
        public long DeviceId { get; set; }
        public string Status { get; set; }
        public bool Online { get; set; }
        public bool On { get; set; }
    }
}
