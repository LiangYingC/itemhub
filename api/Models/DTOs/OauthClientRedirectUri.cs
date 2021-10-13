using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class OauthClientRedirectUri : DTOs
        {
            [Required]
            [MaxLength(512)]
            public string Uri { get; set; }
            public long OauthClientId { get; set; }
        }
    }
}
