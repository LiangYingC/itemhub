using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class Trigger
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public long OwnerId { get; set; }
        public DateTime? DeletedAt { get; set; }
        [Required]
        public long SourceDeviceId { get; set; }
        [Required]
        [MaxLength(3)]
        public string SourcePin { get; set; }
        [Required]
        public decimal SourceThreshold { get; set; }
        public Device SourceDevice { get; set; }
        [Required]
        public long DestinationDeviceId { get; set; }
        [Required]
        [MaxLength(3)]
        public string DestinationPin { get; set; }
        public Device DestinationDevice { get; set; }
        [Required]
        public decimal DestinationDeviceSourceState { get; set; }
        [Required]
        public decimal DestinationDeviceTargetState { get; set; }

        [Required]
        public TRIGGER_OPERATOR Operator { get; set; }

    }
}
