using System;
using Homo.Api;

namespace Homo.IotApi
{
    public partial class OauthClient
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public long OwnerId { get; set; }

        [Required]
        [MaxLength(128)]
        public string ClientId { get; set; }
        [Required]
        [MaxLength(4096)]
        public string HashClientSecrets { get; set; }
        [Required]
        [MaxLength(128)]
        public string Salt { get; set; }

    }
}
