using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class OauthCode : DTOs
        {
            [Required]
            [MaxLength(20)]
            public string Code { get; set; }
            [Required]
            public DateTime ExpiredAt { get; set; }
            [Required]
            [MaxLength(128)]
            public string ClientId { get; set; }
        }
    }
}
