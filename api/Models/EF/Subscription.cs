using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class Subscription
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        [Required]
        public long OwnerId { get; set; }
        [Required]
        public DateTime StartAt { get; set; }
        [Required]
        public DateTime EndAt { get; set; }
        [Required]
        public int PricingPlan { get; set; }
        [MaxLength(64)]
        public string CardKey { get; set; }
        [MaxLength(67)]
        public string CardToken { get; set; }
        public long? TransactionId { get; set; }
        [Required]
        public bool StopNextSubscribed { get; set; }

        public Subscription()
        {
            StopNextSubscribed = false;
        }
    }
}
