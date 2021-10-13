using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class OauthClientRedirectUri
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        [Required]
        [MaxLength(512)]
        public string Uri { get; set; }
        public long OwnerId { get; set; }
        public long OauthClientId { get; set; }
    }
}
