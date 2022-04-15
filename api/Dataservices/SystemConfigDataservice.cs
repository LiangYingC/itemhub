using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class SystemConfigDataservice
    {
        public static void OccupeAutoPaymentLocker(IotDbContext dbContext, string lockerKey)
        {
            dbContext.SystemConfig.Where(x => x.Key == SYSTEM_CONFIG.AUTO_PAYMENT_LOCKER).UpdateFromQuery(x => new SystemConfig
            {
                Key = SYSTEM_CONFIG.AUTO_PAYMENT_LOCKER,
                Value = lockerKey
            });
        }


        public static SystemConfig GetOne(IotDbContext dbContext, string key)
        {
            return dbContext.SystemConfig.FirstOrDefault(x => x.Key == key);
        }

    }
}
