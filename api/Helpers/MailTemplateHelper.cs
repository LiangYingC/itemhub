using api.Constants;
using System.IO;
using System.Reflection;

namespace api.Helpers
{
    public class MailTemplateHelper
    {
        public static MailTemplate Get(MAIL_TEMPLATE key)
        {
            string filePath = "";
            string subject = "";
            if (key == MAIL_TEMPLATE.VERIFY_EMAIL)
            {
                filePath = "static/email/verify-email.html";
                subject = "mailSubjectVerifyEmail";
            }
            else if (key == MAIL_TEMPLATE.TWO_FACTOR_AUTH)
            {
                filePath = "static/email/two-factor-auth.html";
                subject = "mailSubjectTwoFactorAuth";
            }
            else if (key == MAIL_TEMPLATE.RESET_PASSWORD)
            {
                filePath = "static/email/reset-password.html";
                subject = "mailSubjectResetPasword";
            }
            else if (key == MAIL_TEMPLATE.OVER_SUBSCRIPTION)
            {
                filePath = "static/email/over-subscription.html";
                subject = "mailSubjectOverPlan";
            }
            else if (key == MAIL_TEMPLATE.CONTACT_US)
            {
                filePath = "static/email/contact-us.html";
                subject = "mailSubjectContactUs";
            }
            else if (key == MAIL_TEMPLATE.EARLY_BIRD_REGISTER)
            {
                filePath = "static/email/early-bird-register.html";
                subject = "mailSubjectEarlyBirdRegister";
            }
            else if (key == MAIL_TEMPLATE.NEW_PREIUM_USER)
            {
                filePath = "static/email/new-premium-user.html";
                subject = "mailSubjectGetNewPremiumUser";
            }

            string content = File.ReadAllText(filePath);
            return new MailTemplate()
            {
                Subject = subject,
                Content = content
            };
        }

        public static MailTemplate ReplaceVariable(MailTemplate template, dynamic variable)
        {
            string newSubject = template.Subject;
            string newContent = template.Content;
            foreach (var prop in variable.GetType().GetProperties())
            {
                var value = prop.GetValue(variable);
                newSubject = newSubject.Replace("{{" + prop.Name + "}}", value.ToString());
                newContent = newContent.Replace("{{" + prop.Name + "}}", value.ToString());
            }

            return new MailTemplate() { Subject = newSubject, Content = newContent };
        }
    }


    public class MailTemplate
    {
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}