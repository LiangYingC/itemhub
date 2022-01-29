using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class Transaction : DTOs
        {
            [Required]
            public string Raw { get; set; }
            [Required]
            public long OwnerId { get; set; }
        }
    }
}
