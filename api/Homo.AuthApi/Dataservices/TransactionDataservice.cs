using System;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class TransactionDataservice
    {
        public static Transaction Create(IotDbContext dbContext, DTOs.Transaction dto)
        {
            Transaction record = new Transaction();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            dbContext.Transaction.Add(record);
            dbContext.SaveChanges();
            return record;
        }
        public static Transaction GetOne(IotDbContext dbContext, long ownerId, long id)
        {
            return dbContext.Transaction.Where(x => x.DeletedAt == null && x.OwnerId == ownerId && x.Id == id).FirstOrDefault();
        }

        public static Transaction GetOneByExternalId(IotDbContext dbContext, string externalTransactionId)
        {
            return dbContext.Transaction.Where(x => x.DeletedAt == null && x.ExternalTransactionId == externalTransactionId).FirstOrDefault();
        }

        public static void UpdateTransitionRaw(IotDbContext dbContext, Transaction transaction, string raw, string externalTransactionId)
        {
            transaction.Raw = raw;
            transaction.ExternalTransactionId = externalTransactionId;
            dbContext.SaveChanges();
        }
    }
}
