using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class DevicePinStateDataservice
    {
        public static DevicePinState GetOne(IotDbContext dbContext, long? deviceId, byte? mode, string pin)
        {
            return dbContext.DevicePinState
                .Where(x =>
                    x.DeletedAt == null &&
                    (deviceId == null || x.DeviceId == deviceId) &&
                    (mode == null || x.Mode == mode) &&
                    (pin == null || x.Pin == pin)
                )
                .FirstOrDefault();
        }
        public static List<DevicePinState> GetAll(IotDbContext dbContext, long? ownerId, List<long> deviceIds, byte? mode, string pin)
        {
            return dbContext.DevicePinState
                .Where(x =>
                    x.DeletedAt == null &&
                    (ownerId == null || x.OwnerId == ownerId) &&
                    (deviceIds == null || deviceIds.Contains(x.DeviceId)) &&
                    (mode == null || x.Mode == (byte)mode) &&
                    (pin == null || x.Pin == pin)
                )
                .ToList<DevicePinState>();
        }

        public static DevicePinState Create(IotDbContext dbContext, long ownerId, long deviceId, DTOs.DevicePinState dto)
        {
            DevicePinState record = new DevicePinState();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            record.OwnerId = ownerId;
            record.DeviceId = deviceId;
            dbContext.DevicePinState.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchDelete(IotDbContext dbContext, long ownerId, List<long> ids)
        {
            foreach (long id in ids)
            {
                DevicePinState record = new DevicePinState { Id = id, OwnerId = ownerId };
                dbContext.Attach<DevicePinState>(record);
                record.DeletedAt = DateTime.Now;
            }
            dbContext.SaveChanges();
        }

        public static void Update(IotDbContext dbContext, long ownerId, long id, DTOs.DevicePinState dto)
        {
            DevicePinState record = dbContext.DevicePinState.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.EditedAt = DateTime.Now;
            dbContext.SaveChanges();
        }
        public static void UpdateValueByDeviceId(IotDbContext dbContext, long ownerId, long deviceId, string pin, decimal value)
        {
            DevicePinState record = dbContext.DevicePinState.Where(x =>
                x.DeviceId == deviceId
                && x.OwnerId == ownerId
                && x.Pin == pin
                && x.Mode == (byte)DEVICE_MODE.SWITCH
            ).FirstOrDefault();
            record.Value = value;
            record.EditedAt = DateTime.Now;
            dbContext.SaveChanges();
        }

        public static void Delete(IotDbContext dbContext, long ownerId, long id)
        {
            DevicePinState record = dbContext.DevicePinState.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
            record.DeletedAt = DateTime.Now;
            dbContext.SaveChanges();
        }

    }
}
