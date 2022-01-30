using System;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class SubscriptionDataservice
    {
        public static Subscription Create(IotDbContext dbContext, DTOs.Subscription dto)
        {
            Subscription record = new Subscription();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = DateTime.Now;
            dbContext.Subscription.Add(record);
            dbContext.SaveChanges();
            return record;
        }

        public static List<Subscription> GetAll(IotDbContext dbContext, long? ownerId, PRICING_PLAN? pricingPlan, DateTime? current)
        {
            return dbContext.Subscription.Where(x =>
                (ownerId == null || x.OwnerId == ownerId)
                && (pricingPlan == null || x.PricingPlan == (int)pricingPlan)
                && x.DeletedAt == null
                && (current == null || (x.StartAt <= current && x.EndAt >= current))
            ).ToList<Subscription>();
        }

        public static List<Subscription> GetShouldBeAutoPayNextPeriod(IotDbContext dbContext, DateTime nextStartAt)
        {
            DateTime filterStartAt = nextStartAt.AddMonths(-1);
            return dbContext.Subscription
                .Where(x =>
                    x.DeletedAt == null
                    && x.StopNextSubscribed
                    && x.EndAt > filterStartAt // 當前時間減一個月確定前一期是否有資料
                    && !dbContext.Subscription.Any(y => nextStartAt >= y.StartAt && nextStartAt <= y.EndAt) // 同時沒有當期的資料
                )
                .ToList();
        }

        public static void CancelSubscription(IotDbContext dbContext, long ownerId)
        {

        }
    }
}
