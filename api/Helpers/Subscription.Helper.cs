using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Homo.IotApi
{
    public static class SubscriptionHelper
    {
        public static decimal GetPrice(PRICING_PLAN pricingPlan)
        {
            if (pricingPlan == PRICING_PLAN.FREE)
            {
                return 0;
            }
            if (pricingPlan == PRICING_PLAN.BASIC)
            {
                return 49;
            }
            else if (pricingPlan == PRICING_PLAN.ADVANCE)
            {
                return 199;
            }
            else if (pricingPlan == PRICING_PLAN.GROWTH)
            {
                return 999;
            }
            else if (pricingPlan == PRICING_PLAN.SMALL_BUSINESS)
            {
                return 4999;
            }
            return 999999;
        }
    }
}
