using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {

        public partial class DevicePinData : DTOs
        {
            public decimal Value { get; set; }
        }
    }
}
