using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class OauthClient : DTOs
        {
            [Required]
            [MaxLength(128)]
            public string ClientId { get; set; }
        }
    }
}
