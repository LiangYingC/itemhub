using System;
using System.Collections.Generic;
using Homo.Api;

namespace Homo.AuthApi
{

    public abstract partial class DTOs
    {
        public partial class ResetMyPassword
        {
            public string OlderPassword { get; set; }
            public string Password { get; set; }
        }

        public partial class UpdateMe
        {
            [MaxLength(20)]
            public string Phone { get; set; }
            public string Address { get; set; }

            [MaxLength(64)]
            public string Email { get; set; }
            [MaxLength(512)]
            public string Profile { get; set; }

            [MaxLength(64)]
            public string FirstName { get; set; }
            [MaxLength(64)]

            public string LastName { get; set; }
            public byte? Gender { get; set; }

            [MaxLength(64)]
            public string County { get; set; }
            [MaxLength(64)]
            public string City { get; set; }
            [MaxLength(10)]
            public string Zip { get; set; }
            public bool? IsSubscription { get; set; }
            public DateTime? Birthday { get; set; }
        }

        public partial class UpdateMePseudonymous
        {

            public string PseudonymousPhone { get; set; }
            public string PseudonymousAddress { get; set; }
            public string EncryptPhone { get; set; }
            public string EncryptAddress { get; set; }
            public string Email { get; set; }
            public string Profile { get; set; }

            public string FirstName { get; set; }

            public string LastName { get; set; }
            public byte? Gender { get; set; }

            public string County { get; set; }
            public string City { get; set; }
            public string Zip { get; set; }
            public bool? IsSubscription { get; set; }
            public DateTime? Birthday { get; set; }
        }


        public partial class SendSms
        {
            [MaxLength(20)]
            public string Phone { get; set; }
        }

        public partial class VerifyPhone
        {
            [MaxLength(20)]
            [Required]
            public string Phone { get; set; }
            [MaxLength(6)]
            [Required]
            public string Code { get; set; }
        }
    }
}