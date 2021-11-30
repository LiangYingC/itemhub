using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class CheckIn : DTOs
        {
            [Required]
            public string Email { get; set; }
        }
    }
}
