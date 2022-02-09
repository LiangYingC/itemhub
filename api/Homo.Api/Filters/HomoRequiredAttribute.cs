using System.ComponentModel.DataAnnotations;

namespace Homo.Api
{
    public class Required : RequiredAttribute
    {
        public Required() : base()
        {
        }
        protected override ValidationResult IsValid(dynamic value, ValidationContext validationContext)
        {
            if (value != null && value.GetType().IsEnum)
            {
                return ValidationResult.Success;
            }

            if (value != null && value.GetType().Name == "Byte" && value.ToString().Length > 0)
            {
                return ValidationResult.Success;
            }

            string stringify = (string)value;
            if (System.String.IsNullOrEmpty(stringify))
            {
                ValidationLocalizer validationLocalizer = validationContext.GetService(typeof(ValidationLocalizer)) as ValidationLocalizer;
                return new ValidationResult(validationLocalizer.Get($"{validationContext.MemberName} is required"));
            }
            return ValidationResult.Success;
        }
    }
}