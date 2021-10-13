using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class DeviceDataservice
    {
        public static List<Device> GetList(IotDbContext dbContext, long ownerId, int page, int limit)
        {
            return dbContext.Device
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .OrderByDescending(x => x.Id)
                .Skip(limit * (page - 1))
                .Take(limit)
                .ToList();
        }

        public static List<Device> GetAll(IotDbContext dbContext, long ownerId)
        {
            return dbContext.Device
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .OrderByDescending(x => x.Id)
                .ToList();
        }
        public static int GetRowNum(IotDbContext dbContext, long ownerId)
        {
            return dbContext.Device
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .Count();
        }

        public static Device GetOne(IotDbContext dbContext, long ownerId, long id)
        {
            return dbContext.Device.FirstOrDefault(x =>
                x.DeletedAt == null
                && x.Id == id
                && x.OwnerId == ownerId
            );
        }

        public static Device GetOneByDeviceId(IotDbContext dbContext, long ownerId, string deviceId)
        {
            return dbContext.Device.FirstOrDefault(x =>
                x.DeletedAt == null
                && x.DeviceId == deviceId
                && x.OwnerId == ownerId
            );
        }

        public static Device Create(IotDbContext dbContext, long ownerId, DTOs.Device dto)
        {
            Device record = new Device();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            record.OwnerId = ownerId;
            dbContext.Device.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchDelete(IotDbContext dbContext, long ownerId, List<long> ids)
        {
            foreach (long id in ids)
            {
                Device record = new Device { Id = id, OwnerId = ownerId };
                dbContext.Attach<Device>(record);
                record.DeletedAt = DateTime.Now;
            }
            dbContext.SaveChanges();
        }

        public static void Update(IotDbContext dbContext, long ownerId, long id, DTOs.Device dto)
        {
            Device record = dbContext.Device.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.EditedAt = DateTime.Now;
            dbContext.SaveChanges();
        }

        public static void Delete(IotDbContext dbContext, long ownerId, long id)
        {
            Device record = dbContext.Device.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
            record.DeletedAt = DateTime.Now;
            dbContext.SaveChanges();
        }
    }
}
