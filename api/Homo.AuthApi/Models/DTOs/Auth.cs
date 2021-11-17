using System;
using Homo.Api;

namespace Homo.AuthApi
{
    public abstract partial class DTOs
    {
        public class SignInWithEmail
        {
            [Required]
            [MaxLength(64)]
            public string Email { get; set; }
            [Required]
            public string Password { get; set; }
        }

        public class SendValidatedEmail
        {
            [Required]
            [MaxLength(64)]
            public string Email { get; set; }
        }

        public class VerifyEmail
        {
            [Required]
            [MaxLength(64)]
            public string Email { get; set; }
            [Required]
            [MaxLength(6)]
            public string Code { get; set; }
        }


        public class SignUp
        {
            [Required]
            [MinLength(12)]
            public string Password { get; set; }
            public DateTime? Birthday { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }

        public class AuthWithSocialMedia
        {
            [Required]
            public SocialMediaProvider Provider { get; set; }
            [Required]
            public string Code { get; set; }
            [Required]
            public string RedirectUri { get; set; }
        }

        public class ResetPassword
        {
            [Required]
            public string Token { get; set; }
            public string Password { get; set; }
        }

        public class SendResetPasswordLink
        {
            [Required]
            [MaxLength(64)]
            public string Email { get; set; }
        }

        public class RemoveFbSub
        {
            [Required]
            public string signed_request { get; set; }
        }
    }
}
