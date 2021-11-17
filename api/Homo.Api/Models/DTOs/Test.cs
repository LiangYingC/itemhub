// using System.ComponentModel.DataAnnotations;

namespace Homo.Api
{
    public abstract partial class DTOs
    {
        public class Test
        {
            [Required]
            public string Name { get; set; }
        }
    }

}