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

        public static Subscription GetOne(IotDbContext dbContext, long? ownerId)
        {
            return dbContext.Subscription.Where(x =>
                (ownerId == null || x.OwnerId == ownerId)
                && x.DeletedAt == null
            ).OrderByDescending(x => x.Id).FirstOrDefault();
        }

        public static Subscription GetCurrnetOne(IotDbContext dbContext, long? ownerId)
        {
            return dbContext.Subscription.Where(x =>
                (ownerId == null || x.OwnerId == ownerId)
                && x.DeletedAt == null
                && x.StartAt <= DateTime.Now
                && x.EndAt >= DateTime.Now
            ).OrderByDescending(x => x.Id).FirstOrDefault();
        }

        public static List<Subscription> GetShouldBeAutoPayNextPeriod(IotDbContext dbContext, DateTime nextStartAt)
        {
            DateTime filterStartAt = nextStartAt.AddMonths(-1);
            return dbContext.Subscription
                .Where(x =>
                    x.DeletedAt == null
                    && !x.StopNextSubscribed
                    && x.EndAt > filterStartAt // 當前時間減一個月確定前一期是否有資料
                    && !dbContext.Subscription.Any(y => nextStartAt >= y.StartAt && nextStartAt <= y.EndAt) // 同時沒有當期的資料
                )
                .ToList();
        }

        public static void CancelSubscription(IotDbContext dbContext, long ownerId)
        {
            dbContext.Subscription.Where(x => x.DeletedAt == null && x.OwnerId == ownerId).UpdateFromQuery(x => new Subscription() { StopNextSubscribed = true });
        }

        public static void DeleteSubscription(IotDbContext dbContext, long id)
        {
            dbContext.Subscription.Where(x => x.DeletedAt == null && x.Id == id).UpdateFromQuery(x => new Subscription() { DeletedAt = System.DateTime.Now });
        }

        public static Subscription GetOneByTransactionId(IotDbContext dbContext, long ownerId, long transactionId)
        {
            return dbContext.Subscription.Where(x => x.DeletedAt == null && x.OwnerId == ownerId && x.TransactionId == transactionId).FirstOrDefault();
        }
    }
}
