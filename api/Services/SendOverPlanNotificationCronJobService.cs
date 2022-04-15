using System;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Homo.AuthApi;
using System.Collections.Generic;

namespace Homo.IotApi
{
    public class SendOverPlanNotificationCronJobService : CronJobService
    {
        private readonly string _envName;
        private readonly string _dbc;
        private readonly string _systemMail;
        private readonly string _sendGridApiKey;
        private readonly string _websiteUrl;

        public SendOverPlanNotificationCronJobService(IScheduleConfig<SendOverPlanNotificationCronJobService> config, IServiceProvider serviceProvider, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, IOptions<AppSettings> appSettings)
            : base(config.CronExpression, config.TimeZoneInfo, serviceProvider)
        {
            _envName = env.EnvironmentName;
            _dbc = appSettings.Value.Secrets.DBConnectionString;
            _systemMail = appSettings.Value.Common.SystemEmail;
            _sendGridApiKey = appSettings.Value.Secrets.SendGridApiKey;
            _websiteUrl = appSettings.Value.Common.WebsiteUrl;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("SendOverPlanNotificationCronJobService starts.");
            return base.StartAsync(cancellationToken);
        }

        public override Task DoWork(CancellationToken cancellationToken)
        {
            Console.WriteLine($"{DateTime.Now:hh:mm:ss} SendOverPlanNotificationCronJobService is working.");
            DbContextOptionsBuilder<DBContext> builder = new DbContextOptionsBuilder<DBContext>();
            DbContextOptionsBuilder<IotDbContext> iotBuilder = new DbContextOptionsBuilder<IotDbContext>();
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 25));
            builder.UseMySql(_dbc, serverVersion);
            iotBuilder.UseMySql(_dbc, serverVersion);
            DBContext _dbContext = new DBContext(builder.Options);
            IotDbContext _iotDbContext = new IotDbContext(iotBuilder.Options);
            List<User> overPlanUsers = UserDataservice.GetOverPlanAll(_dbContext);
            for (int i = 0; i < overPlanUsers.Count; i++)
            {
                User user = overPlanUsers[i];
                List<Homo.AuthApi.ConvertHelper.EnumList> frequency = ConvertHelper.EnumToList(typeof(SEND_OVER_PLAN_NOTIFICATION_FREQUENCY));
                List<Homo.AuthApi.ConvertHelper.EnumList> pricingPlans = ConvertHelper.EnumToList(typeof(PRICING_PLAN));
                if (user.SendOverPlanNotificationCount >= frequency.Count)
                {
                    continue;
                }


                DateTime? whenToSendNextTime = null;
                if (user.SendOverPlanNotificationAt != null)
                {
                    whenToSendNextTime = user.SendOverPlanNotificationAt.GetValueOrDefault().AddDays(7 * (int)frequency[user.SendOverPlanNotificationCount + 1].Value);
                }

                bool shouldBeSent = false;
                if (whenToSendNextTime == null || DateTime.Now >= whenToSendNextTime)
                {
                    shouldBeSent = true;
                }

                if (shouldBeSent)
                {
                    Subscription subscription = SubscriptionDataservice.GetOne(_iotDbContext, user.Id);
                    int nextSubscription = 0;
                    if (subscription != null)
                    {
                        nextSubscription = subscription.PricingPlan + 1;
                    }
                    string content = "";
                    if (nextSubscription > pricingPlans.Count - 1)
                    {
                        content = $"你所用量已經超過了最高的方案, 如果需要保存所有資料請與我們聯繫, 我們將提供更進階的方案 itemhub.tw@gmail.com";
                    }
                    else
                    {
                        content = $"升級訂閱方案 {_websiteUrl}/checkout/?pricingPlan={nextSubscription}";
                    }

                    MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
                    {
                        Subject = "Itemhub - 超過訂閱方案",
                        Content = content
                    }, _systemMail, user.Email,
                    _sendGridApiKey);

                    user.SendOverPlanNotificationCount += 1;
                    user.SendOverPlanNotificationAt = DateTime.Now;
                }

            }

            _dbContext.SaveChanges();
            return Task.CompletedTask;
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("SendOverPlanNotificationCronJobService is stopping.");
            return base.StopAsync(cancellationToken);
        }

    }
}
