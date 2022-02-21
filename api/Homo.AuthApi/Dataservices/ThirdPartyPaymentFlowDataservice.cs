using System;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class ThirdPartyPaymentFlowDataservice
    {
        public static ThirdPartyPaymentFlow Create(IotDbContext dbContext, DTOs.ThirdPartyPaymentFlow dto)
        {
            ThirdPartyPaymentFlow record = new ThirdPartyPaymentFlow();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            dbContext.ThirdPartyPaymentFlow.Add(record);
            dbContext.SaveChanges();
            return record;
        }
    }
}
