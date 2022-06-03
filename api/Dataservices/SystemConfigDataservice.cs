using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Homo.IotApi
{
    public class SystemConfigDataservice
    {
        public static void OccupeLocker(IotDbContext dbContext, string SystemConfigKey, string lockerKey)
        {
            dbContext.SystemConfig.Where(x => x.Key == SystemConfigKey).UpdateFromQuery(x => new SystemConfig
            {
                Key = SystemConfigKey,
                Value = lockerKey
            });
        }


        public static SystemConfig GetOne(IotDbContext dbContext, string key)
        {
            return dbContext.SystemConfig.FirstOrDefault(x => x.Key == key);
        }

    }
}
