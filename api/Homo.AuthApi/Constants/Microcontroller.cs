using System.ComponentModel;

namespace Homo.AuthApi
{
    public enum MICROCONTROLLER
    {
        [Description("particle io photon")]
        PARTICLE_IO_PHOTON,
        [Description("arduino nano 33 iot")]
        ARDUINO_NANO_33_IOT,
        [Description("esp 01s")]
        ESP_01S,
    }
}