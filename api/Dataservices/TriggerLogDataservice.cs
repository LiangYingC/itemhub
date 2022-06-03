using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class TriggerLogDataservice
    {
        public static TriggerLog Create(IotDbContext dbContext, long triggerId, string raw)
        {
            TriggerLog record = new TriggerLog();
            record.CreatedAt = DateTime.Now;
            record.TriggerId = triggerId;
            record.Raw = raw;
            dbContext.TriggerLog.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchedCreate(IotDbContext dbContext, List<Trigger> list)
        {
            list.ForEach(item =>
            {
                TriggerLog record = new TriggerLog();
                record.CreatedAt = DateTime.Now;
                record.TriggerId = item.Id;
                record.Raw = Newtonsoft.Json.JsonConvert.SerializeObject(item);
                dbContext.TriggerLog.Add(record);
            });
            dbContext.SaveChanges();
        }

        public static void Delete(IotDbContext dbContext, DateTime endAt)
        {
            dbContext.TriggerLog.Where(x => x.CreatedAt <= endAt).DeleteFromQuery();
        }

    }
}
