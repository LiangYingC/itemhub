using Microsoft.AspNetCore.Mvc;
using Homo.AuthApi;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    [Route("v1/universal")]
    public class IotUniversalController : ControllerBase
    {

        public IotUniversalController()
        {
        }

        [HttpGet]
        [Route("pricing-plans")]
        public ActionResult<dynamic> getPricingPlans()
        {
            List<dynamic> pricingPlans = ConvertHelper.EnumToList(typeof(PRICING_PLAN)).Select(x =>
            new
            {
                x.Key,
                x.Value,
                x.Label,
                Price = SubscriptionHelper.GetPrice((PRICING_PLAN)x.Value)
            }).ToList<dynamic>();

            return pricingPlans;
        }
    }
}
