using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class DeviceActivityLog
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        [Required]
        public long DeviceId { get; set; }
        [Required]
        public long OwnerId { get; set; }
    }
}
