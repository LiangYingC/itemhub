using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class ZoneDataservice
    {
        public static List<Zone> GetList(IotDbContext dbContext, long ownerId, int page, int limit)
        {
            return dbContext.Zone
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .OrderByDescending(x => x.Id)
                .Skip(limit * (page - 1))
                .Take(limit)
                .ToList();
        }

        public static List<Zone> GetAll(IotDbContext dbContext, long ownerId)
        {
            return dbContext.Zone
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .OrderByDescending(x => x.Id)
                .ToList();
        }
        public static int GetRowNum(IotDbContext dbContext, long ownerId)
        {
            return dbContext.Zone
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .Count();
        }

        public static Zone GetOne(IotDbContext dbContext, long ownerId, long id)
        {
            return dbContext.Zone.FirstOrDefault(x => x.DeletedAt == null && x.Id == id && x.OwnerId == ownerId);
        }

        public static Zone Create(IotDbContext dbContext, long ownerId, DTOs.Zone dto)
        {
            Zone record = new Zone();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.OwnerId = ownerId;
            record.CreatedAt = DateTime.Now;
            dbContext.Zone.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchDelete(IotDbContext dbContext, long ownerId, List<long> ids)
        {
            foreach (long id in ids)
            {
                Zone record = new Zone { Id = id, OwnerId = ownerId };
                dbContext.Attach<Zone>(record);
                record.DeletedAt = DateTime.Now;
            }
            dbContext.SaveChanges();
        }

        public static void Update(IotDbContext dbContext, long ownerId, long id, DTOs.Zone dto)
        {
            Zone record = dbContext.Zone.Where(x => x.OwnerId == ownerId && x.Id == id).FirstOrDefault();
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
            Zone record = dbContext.Zone.Where(x => x.OwnerId == ownerId && x.Id == id).FirstOrDefault();
            record.DeletedAt = DateTime.Now;
            dbContext.SaveChanges();
        }
    }
}
