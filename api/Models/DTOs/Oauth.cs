using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class Oauth : DTOs
        {
            [Required]
            public string grant_type { get; set; }

            [MaxLength(20)]
            [Required]
            public string code { get; set; }
            public string redirect_uri { get; set; }
            [Required]
            [MaxLength(128)]
            public string client_id { get; set; }
            [Required]
            [MaxLength(128)]
            public string client_secret { get; set; }
        }
    }
}
