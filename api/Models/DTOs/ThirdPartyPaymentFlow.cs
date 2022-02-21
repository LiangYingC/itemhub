using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class ThirdPartyPaymentFlow : DTOs
        {
            [Required]
            public string Raw { get; set; }
            [Required]
            public string ExternalTransactionId { get; set; }
        }
    }
}
