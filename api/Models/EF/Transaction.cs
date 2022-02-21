using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class Transaction
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        [Required]
        public long OwnerId { get; set; }
        public string Raw { get; set; }
        [MaxLength(64)]
        public string ExternalTransactionId { get; set; }
        [Required]
        public TRANSACTION_STATUS Status { get; set; }
        [Required]
        public decimal Amount { get; set; }
    }
}
