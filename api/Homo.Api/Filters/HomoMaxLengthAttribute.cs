using System.ComponentModel.DataAnnotations;

namespace Homo.Api
{
    public class MaxLength : MaxLengthAttribute
    {
        public MaxLength(int length) : base(length)
        {
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            ValidationResult result = base.IsValid(value, validationContext);

            if (result != null)
            {
                ValidationLocalizer validationLocalizer = validationContext.GetService(typeof(ValidationLocalizer)) as ValidationLocalizer;
                return new ValidationResult(validationLocalizer.Get($"{validationContext.MemberName} length bigger than {this.Length}"));
            }
            return ValidationResult.Success;
        }
    }
}