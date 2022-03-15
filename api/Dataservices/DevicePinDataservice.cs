using System.Collections.Generic;
using System.Linq;
using System;

namespace Homo.IotApi
{
    public class DevicePinDataservice
    {
        public static List<DevicePin> GetList(IotDbContext dbContext, long ownerId, long deviceId)
        {
            IEnumerable<DevicePin> fromSensorData = dbContext.DevicePinSensor
                .Where(x =>
                    x.DeletedAt == null
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
                    LastId = g.Max(x => x.Id),
                    CreatedAt = g.Max(x => x.CreatedAt)
                })
                .Join(dbContext.DevicePinSensor, x => x.LastId, y => y.Id, (x, y) => new DevicePin
                {
                    DeviceId = x.DeviceId,
                    Pin = x.Pin,
                    Mode = DEVICE_MODE.SENSOR,
                    State = (decimal)y.Value,
                    CreatedAt = y.CreatedAt,
                    OwnerId = ownerId
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
                    State = (decimal)x.Value,
                    CreatedAt = null,
                    OwnerId = x.OwnerId
                });

            return fromSensorData.Union(fromSwitch).ToList<DevicePin>().GroupJoin(dbContext.DevicePinName
            , x => new { x.DeviceId, x.Pin, x.OwnerId }
            , y => new { y.DeviceId, y.Pin, y.OwnerId, }
            , (sensorGroupByDevice, devicePinNames) => new
            {
                SensorGroupByDevice = sensorGroupByDevice,
                DevicePinName = devicePinNames.Where(x => x.DeletedAt == null).FirstOrDefault()?.Name
            }).Select(x => new DevicePin()
            {
                DeviceId = x.SensorGroupByDevice.DeviceId,
                Pin = x.SensorGroupByDevice.Pin,
                Mode = x.SensorGroupByDevice.Mode,
                State = x.SensorGroupByDevice.State,
                CreatedAt = x.SensorGroupByDevice.CreatedAt,
                Name = x.DevicePinName
            }).ToList<DevicePin>();
        }

        public static void RemoveUnuseSwitchPins(IotDbContext dbContext, long ownerId, long deviceId, List<string> usedPins)
        {
            dbContext.DevicePinSwitch.Where(x =>
                x.OwnerId == ownerId
                && x.DeviceId == deviceId
                && !usedPins.Contains(x.Pin)).UpdateFromQuery(x => new DevicePinSwitch()
                {
                    DeletedAt = DateTime.Now
                });
        }

        public static void UpdatePinName(IotDbContext dbContext, long ownerId, long deviceId, string pin, string name)
        {
            dbContext.DevicePinName.Where(x =>
                x.OwnerId == ownerId
                && x.DeviceId == deviceId
                && x.Pin == pin
            ).UpdateFromQuery(x => new DevicePinName()
            {
                DeletedAt = DateTime.Now
            });

            var newOne = new DevicePinName()
            {
                OwnerId = ownerId,
                DeviceId = deviceId,
                CreatedAt = DateTime.Now,
                Pin = pin,
                Name = name
            };

            dbContext.DevicePinName.Add(newOne);
            dbContext.SaveChanges();
        }
    }

    public class DevicePin
    {
        public string Pin { get; set; }
        public long DeviceId { get; set; }
        public DEVICE_MODE Mode { get; set; }
        public decimal State { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string Name { get; set; }
        public long OwnerId { get; set; }
    }
}
