using System;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class DeviceActivityLogDataservice
    {
        public static int GetRowNumThis15Seconds(IotDbContext dbContext, long ownerId, long deviceId)
        {
            return dbContext.DeviceActivityLog.Where(x =>
                x.DeletedAt == null
                && x.DeviceId == deviceId
                && x.OwnerId == ownerId
                && (DateTime.Now - x.CreatedAt).TotalSeconds <= 15
            ).Count();
        }

        public static DeviceActivityLog Create(IotDbContext dbContext, long ownerId, long deviceId)
        {
            DeviceActivityLog record = new DeviceActivityLog();
            record.CreatedAt = DateTime.Now;
            record.OwnerId = ownerId;
            record.DeviceId = deviceId;
            dbContext.DeviceActivityLog.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static long? Delete(IotDbContext dbContext, DateTime endAt, int page, int limit, long? lastId)
        {
            List<DeviceActivityLog> items = dbContext.DeviceActivityLog
                .Where(x =>
                    x.CreatedAt <= endAt
                    && (lastId == null || x.Id < lastId)
                )
                .OrderBy(x => x.Id)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            if (items.Count() == 0)
            {
                return null;
            }

            items.ForEach(item =>
            {
                dbContext.DeviceActivityLog.Remove(item);
            });
            DeviceActivityLog lastOne = items.LastOrDefault();
            long? currentLastId = lastOne == null ? null : lastOne.Id;
            dbContext.SaveChanges();
            return currentLastId;
        }
    }
}
