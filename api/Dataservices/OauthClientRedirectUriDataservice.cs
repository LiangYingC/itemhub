using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class OauthClientRedirectUriDataservice
    {
        public static List<OauthClientRedirectUri> GetList(IotDbContext dbContext, long ownerId, int page, int limit)
        {
            return dbContext.OauthClientRedirectUri
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .OrderByDescending(x => x.Id)
                .Skip(limit * (page - 1))
                .Take(limit)
                .ToList();
        }

        public static List<OauthClientRedirectUri> GetAll(IotDbContext dbContext, long ownerId)
        {
            return dbContext.OauthClientRedirectUri
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .OrderByDescending(x => x.Id)
                .ToList();
        }
        public static int GetRowNum(IotDbContext dbContext, long ownerId)
        {
            return dbContext.OauthClientRedirectUri
                .Where(x =>
                    x.DeletedAt == null
                    && x.OwnerId == ownerId
                )
                .Count();
        }

        public static OauthClientRedirectUri GetOne(IotDbContext dbContext, long ownerId, long id)
        {
            return dbContext.OauthClientRedirectUri.FirstOrDefault(x => x.DeletedAt == null && x.Id == id && x.OwnerId == ownerId);
        }

        public static OauthClientRedirectUri GetOneByRedirectUri(IotDbContext dbContext, long ownerId, string redirectUri)
        {
            return dbContext.OauthClientRedirectUri.FirstOrDefault(x => x.DeletedAt == null && x.Uri == redirectUri && x.OwnerId == ownerId);
        }

        public static OauthClientRedirectUri Create(IotDbContext dbContext, long ownerId, DTOs.OauthClientRedirectUri dto)
        {
            OauthClientRedirectUri record = new OauthClientRedirectUri();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.OwnerId = ownerId;
            record.CreatedAt = DateTime.Now;
            dbContext.OauthClientRedirectUri.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static void BatchDelete(IotDbContext dbContext, long ownerId, List<long> ids)
        {
            foreach (long id in ids)
            {
                OauthClientRedirectUri record = new OauthClientRedirectUri { OwnerId = ownerId, Id = id };
                dbContext.Attach<OauthClientRedirectUri>(record);
                record.DeletedAt = DateTime.Now;
            }
            dbContext.SaveChanges();
        }

        public static void Update(IotDbContext dbContext, long ownerId, long id, DTOs.OauthClientRedirectUri dto)
        {
            OauthClientRedirectUri record = dbContext.OauthClientRedirectUri.Where(x => x.OwnerId == ownerId && x.Id == id).FirstOrDefault();
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
            OauthClientRedirectUri record = dbContext.OauthClientRedirectUri.Where(x => x.OwnerId == ownerId && x.Id == id).FirstOrDefault();
            record.DeletedAt = DateTime.Now;
            dbContext.SaveChanges();
        }
    }
}
