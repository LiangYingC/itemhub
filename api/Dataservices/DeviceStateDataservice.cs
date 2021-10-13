using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class DeviceStateDataservice
    {
        public static DeviceState GetOne(IotDbContext dbContext, long? deviceId, byte? mode, string pin)
        {
            return dbContext.DeviceState
                .Where(x =>
                    x.DeletedAt == null &&
                    (deviceId == null || x.DeviceId == deviceId) &&
                    (mode == null || x.Mode == mode) &&
                    (pin == null || x.Pin == pin)
                )
                .FirstOrDefault();
        }
        public static List<DeviceState> GetAll(IotDbContext dbContext, long? ownerId, List<long> deviceIds, byte? mode, string pin)
        {
            return dbContext.DeviceState
                .Where(x =>
                    x.DeletedAt == null &&
                    (ownerId == null || x.OwnerId == ownerId) &&
                    (deviceIds == null || deviceIds.Contains(x.DeviceId)) &&
                    (mode == null || x.Mode == (byte)mode) &&
                    (pin == null || x.Pin == pin)
                )
                .ToList<DeviceState>();
        }

        public static DeviceState Create(IotDbContext dbContext, long ownerId, long deviceId, DTOs.DeviceState dto)
        {
            DeviceState record = new DeviceState();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            record.OwnerId = ownerId;
            record.DeviceId = deviceId;
            dbContext.DeviceState.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchDelete(IotDbContext dbContext, long ownerId, List<long> ids)
        {
            foreach (long id in ids)
            {
                DeviceState record = new DeviceState { Id = id, OwnerId = ownerId };
                dbContext.Attach<DeviceState>(record);
                record.DeletedAt = DateTime.Now;
            }
            dbContext.SaveChanges();
        }

        public static void Update(IotDbContext dbContext, long ownerId, long id, DTOs.DeviceState dto)
        {
            DeviceState record = dbContext.DeviceState.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
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
            DeviceState record = dbContext.DeviceState.Where(x => x.DeviceId == deviceId && x.OwnerId == ownerId && x.Pin == pin && x.Mode == (byte)DEVICE_MODE.OUTPUT).FirstOrDefault();
            record.Value = value;
            record.EditedAt = DateTime.Now;
            dbContext.SaveChanges();
        }

        public static void Delete(IotDbContext dbContext, long ownerId, long id)
        {
            DeviceState record = dbContext.DeviceState.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
            record.DeletedAt = DateTime.Now;
            dbContext.SaveChanges();
        }

    }
}
