using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class OauthCode
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
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
