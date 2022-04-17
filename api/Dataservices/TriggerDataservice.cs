using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class TriggerDataservice
    {
        public static List<Trigger> GetAll(IotDbContext dbContext, long ownerId, long? sourceDeviceId, string sourcePin)
        {
            return dbContext.Trigger
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                    && (sourceDeviceId == null || x.SourceDeviceId == (long)sourceDeviceId)
                    && (sourcePin == null || x.SourcePin == sourcePin)
                )
                .OrderByDescending(x => x.Id)
                .ToList();
        }

        public static List<Trigger> GetList(IotDbContext dbContext, int page, int limit, long ownerId,
            long? sourceDeviceId,
            string sourcePin,
            string sourceDeviceName,
            long? destinationDeviceId,
            string destinationPin,
            string destinationDeviceName
        )
        {
            return dbContext.Trigger
                .Include(x => x.SourceDevice)
                .Include(x => x.DestinationDevice)
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                    && (sourceDeviceId == null || x.SourceDeviceId == sourceDeviceId)
                    && (sourcePin == null || x.SourcePin == sourcePin)
                    && (destinationDeviceId == null || x.DestinationDeviceId == destinationDeviceId)
                    && (destinationPin == null || x.DestinationPin == destinationPin)
                    && (sourceDeviceName == null || x.SourceDevice.Name == sourceDeviceName)
                    && (destinationDeviceName == null || x.DestinationDevice.Name == destinationDeviceName)
                )
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();
        }

        public static int GetRowNum(IotDbContext dbContext, long ownerId,
            long? sourceDeviceId,
            string sourcePin,
            string sourceDeviceName,
            long? destinationDeviceId,
            string destinationPin,
            string destinationDeviceName
        )
        {
            return dbContext.Trigger
                .Include(x => x.SourceDevice)
                .Include(x => x.DestinationDevice)
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                    && (sourceDeviceId == null || x.SourceDeviceId == sourceDeviceId)
                    && (sourcePin == null || x.SourcePin == sourcePin)
                    && (destinationDeviceId == null || x.DestinationDeviceId == destinationDeviceId)
                    && (destinationPin == null || x.DestinationPin == destinationPin)
                    && (sourceDeviceName == null || x.SourceDevice.Name == sourceDeviceName)
                    && (destinationDeviceName == null || x.DestinationDevice.Name == destinationDeviceName)
                )
                .Count();
        }

        public static Trigger GetOne(IotDbContext dbContext, long ownerId, long? id, long? sourceDeviceId, string sourcePin, long? destinationDeviceId, string destinationPin)
        {
            return dbContext.Trigger
                .Include(x => x.SourceDevice)
                .Include(x => x.DestinationDevice)
                .FirstOrDefault(x =>
                x.DeletedAt == null
                && x.OwnerId == ownerId
                && (id == null || x.Id == id)
                && (sourceDeviceId == null || x.SourceDeviceId == sourceDeviceId)
                && (destinationDeviceId == null || x.DestinationDeviceId == destinationDeviceId)
                && (sourcePin == null || x.SourcePin == sourcePin)
                && (destinationPin == null || x.DestinationPin == destinationPin)
            );
        }

        public static Trigger Create(IotDbContext dbContext, long ownerId, DTOs.Trigger dto)
        {
            Trigger record = new Trigger();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            record.OwnerId = ownerId;
            dbContext.Trigger.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchDelete(IotDbContext dbContext, long ownerId, List<long> ids)
        {
            dbContext.Trigger.Where(x => x.OwnerId == ownerId && ids.Contains(x.Id)).UpdateFromQuery(x => new Trigger()
            {
                DeletedAt = DateTime.Now
            });
        }

        public static void Update(IotDbContext dbContext, long ownerId, long id, DTOs.Trigger dto)
        {
            Trigger record = dbContext.Trigger.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
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
            Trigger record = dbContext.Trigger.Where(x => x.Id == id && x.OwnerId == ownerId).FirstOrDefault();
            record.DeletedAt = DateTime.Now;
            dbContext.SaveChanges();
        }
    }
}
