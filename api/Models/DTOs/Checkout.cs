using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class Checkout : DTOs
        {
            [Required]
            public string prime { get; set; }
            [Required]
            public PRICING_PLAN pricingPlan { get; set; }
            [Required]
            public string email { get; set; }
            [Required]
            public string name { get; set; }
            [Required]
            public string phone { get; set; }

        }
    }
}
