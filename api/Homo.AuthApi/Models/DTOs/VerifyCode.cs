using System;
using System.Collections.Generic;

namespace Homo.AuthApi
{

    public abstract partial class DTOs
    {
        public partial class VerifyCode
        {
            public string Ip { get; set; }
            public string Code { get; set; }
            public DateTime? Expiration { get; set; }
            public string Msgid { get; set; }
            public string Phone { get; set; }
            public string Email { get; set; }
        }

    }

}