using System;
using System.Collections.Generic;
using Homo.Api;

namespace Homo.AuthApi
{
    public partial class VerifyCode
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        [MaxLength(128)]
        public string Ip { get; set; }
        [Required]
        [MaxLength(12)]
        public string Code { get; set; }
        public DateTime Expiration { get; set; }
        public string Msgid { get; set; }
        public string Phone { get; set; }
        public bool? IsUsed { get; set; }
        public string Email { get; set; }
    }
}
