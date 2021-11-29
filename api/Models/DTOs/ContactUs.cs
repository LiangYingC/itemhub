using System;
using Homo.Api;

namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class ContactUs : DTOs
        {
            [Required]
            public string Subject { get; set; }
            public string Content { get; set; }
            public string FromMail { get; set; }

        }
    }
}
