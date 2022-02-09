using System.Collections.Generic;
using System.Linq;
using System;

namespace Homo.IotApi
{
    public class DevicePinDataservice
    {
        public static List<DevicePin> GetList(IotDbContext dbContext, long? ownerId, long deviceId)
        {
            IEnumerable<DevicePin> fromSensorData = dbContext.DevicePinSensor
                .Where(x =>
                    x.DeletedAt == null
                    && x.CreatedAt >= DateTime.Now.AddMinutes(-30)
                    && x.DeviceId == deviceId
                    && x.OwnerId == ownerId
                )
                .GroupBy(x => new
                {
                    x.DeviceId,
                    x.Pin
                })
                .Select(g => new
                {
                    DeviceId = g.Key.DeviceId,
                    Pin = g.Key.Pin,
                    LastId = g.Max(x => x.Id)
                })
                .Join(dbContext.DevicePinSensor, x => x.LastId, y => y.Id, (x, y) => new DevicePin()
                {
                    DeviceId = x.DeviceId,
                    Pin = x.Pin,
                    Mode = DEVICE_MODE.SENSOR,
                    State = (decimal)y.Value
                });

            IEnumerable<DevicePin> fromSwitch = dbContext.DevicePinSwitch
                .Where(x => x.DeletedAt == null
                    && x.DeviceId == deviceId
                    && x.OwnerId == ownerId
                )
                .Select(x => new DevicePin()
                {
                    DeviceId = x.DeviceId,
                    Pin = x.Pin,
                    Mode = DEVICE_MODE.SWITCH,
                    State = (decimal)x.Value
                });

            return fromSensorData.Union(fromSensorData).ToList<DevicePin>();
        }
    }

    public class DevicePin
    {
        public string Pin { get; set; }
        public long DeviceId { get; set; }
        public DEVICE_MODE Mode { get; set; }
        public decimal State { get; set; }
    }
}
