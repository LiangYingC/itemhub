using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Homo.IotApi
{
    public static class StartupOfflineService
    {
        private static Dictionary<long, CancellationTokenSource> tokenSourceCollections = new Dictionary<long, CancellationTokenSource>();
        public static void OfflineTooLongNoActivityDevice(string dbc)
        {

            DbContextOptionsBuilder<IotDbContext> builder = new DbContextOptionsBuilder<IotDbContext>();
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 25));
            builder.UseMySql(dbc, serverVersion);
            IotDbContext newDbContext = new IotDbContext(builder.Options);

            // Get pagination devices
            List<long> ids = DeviceActivityLogDataservice.GetTooLongWithoutActivityDeviceIds(newDbContext, 15);
            DeviceDataservice.OfflineMultiple(newDbContext, ids);
        }
    }
}
