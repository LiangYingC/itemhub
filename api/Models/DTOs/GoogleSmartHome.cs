using System;
using System.Collections.Generic;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class GoogleSmartHome : DTOs
        {
            [Required]
            [MaxLength(32)]
            public string RequestId { get; set; }
            public List<GoogleSmartHomeIntents> Inputs { get; set; }
        }

        public partial class GoogleSmartHomeIntents : DTOs
        {
            public string Intent { get; set; }
            public dynamic Payload { get; set; }
        }
    }
}
