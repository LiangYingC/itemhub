using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class ZonePayload : DTOs
        {
            [Required]
            [MaxLength(64)]
            public string Name { get; set; }
        }
    }
}
