using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class Subscription : DTOs
        {

            [Required]
            public long OwnerId { get; set; }

            [Required]
            public DateTime StartAt { get; set; }

            [Required]
            public DateTime EndAt { get; set; }

            [Required]
            public PRICING_PLAN PricingPlan { get; set; }

            [Required]
            public long TransactionId { get; set; }

            public string CardKey { get; set; }

            public string CardToken { get; set; }

            public SUBSCRIPTION_STATUS Status { get; set; }

        }
    }
}