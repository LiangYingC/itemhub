namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class Firmware : DTOs
        {

            public string ZipPassword { get; set; }
        }


        public class Pin
        {
            public string Name { get; set; }
            public int Value { get; set; }
        }
    }
}
