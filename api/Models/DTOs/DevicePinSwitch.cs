using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class DevicePinSwitchValue : DTOs
        {
            public decimal Value { get; set; }
        }
    }
}
