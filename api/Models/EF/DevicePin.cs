using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class DevicePin
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public long OwnerId { get; set; }
        public long? EditedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        [Required]
        [MaxLength(3)]
        public string Pin { get; set; }
        [Required]
        public DEVICE_MODE Mode { get; set; }
        public string Name { get; set; }
        public decimal? Value { get; set; }
        [Required]
        public long DeviceId { get; set; }
        public Homo.IotApi.Device Device { get; set; }
    }
}
