namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class Firmware : DTOs
        {

            public string ZipPassword { get; set; }
        }


        public enum MICROCONTROLLER
        {
            PARTICLE_IO_PHOTON,
            ARDUINO_NANO_33_IOT,
            ESP_01S
        }
    }
}
