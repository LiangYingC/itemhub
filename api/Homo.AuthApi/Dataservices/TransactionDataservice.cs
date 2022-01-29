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
    }
}
