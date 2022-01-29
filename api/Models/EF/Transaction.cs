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
        [Required]
        public string Raw { get; set; }
    }
}
