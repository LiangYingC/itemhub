using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class ThirdPartyPaymentFlow
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        [MaxLength(64)]
        [Required]
        public string ExternalTransactionId { get; set; }
        public string Raw { get; set; }
    }
}
