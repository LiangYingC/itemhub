using System;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using Homo.AuthApi;
using System.Linq;
using System.Net.Http;
using Newtonsoft.Json;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    public class ClearTriggerLogCronJob : CronJobService
    {
        private readonly string _envName;
        private readonly string _tapPayPartnerKey;
        private readonly string _tapPayMerchantId;
        private readonly string _tapPayEndpointByToken;
        private readonly string _dbc;

        public ClearTriggerLogCronJob(IScheduleConfig<ClearTriggerLogCronJob> config, IServiceProvider serviceProvider, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, IOptions<AppSettings> appSettings)
            : base(config.CronExpression, config.TimeZoneInfo, serviceProvider)
        {
            _envName = env.EnvironmentName;
            _dbc = appSettings.Value.Secrets.DBConnectionString;
            _tapPayMerchantId = appSettings.Value.Secrets.TapPayMerchantId;
            _tapPayPartnerKey = appSettings.Value.Secrets.TapPayPartnerKey;
            _tapPayEndpointByToken = appSettings.Value.Common.TapPayEndpointByToken;

        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("ClearTriggerLogCronJob starts.");
            return base.StartAsync(cancellationToken);
        }

        public override Task DoWork(CancellationToken cancellationToken)
        {
            if (DateTime.Now.Day == 1)
            {
                return Task.CompletedTask;
            }

            Console.WriteLine($"{DateTime.Now:hh:mm:ss} TriggerLogCronJob is working.");
            DbContextOptionsBuilder<IotDbContext> iotBuilder = new DbContextOptionsBuilder<IotDbContext>();
            DbContextOptionsBuilder<DBContext> builder = new DbContextOptionsBuilder<DBContext>();
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 25));
            iotBuilder.UseMySql(_dbc, serverVersion);
            builder.UseMySql(_dbc, serverVersion);
            IotDbContext _iotDbContext = new IotDbContext(iotBuilder.Options);
            TriggerLogDataservice.Delete(_iotDbContext, DateTime.Now.AddDays(-30));
            return Task.CompletedTask;
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("ClearTriggerLogCronJob is stopping.");
            return base.StopAsync(cancellationToken);
        }
    }
}
