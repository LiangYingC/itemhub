using api.Constants;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class DevicePinHelper
    {
        public static int GetPinNumber(DTOs.MICROCONTROLLER mcu, string pinString)
        {
            return DevicePinDictionary[mcu.ToString()][pinString];
        }

        public static Dictionary<string, Dictionary<string, int>> DevicePinDictionary = new Dictionary<string, Dictionary<string, int>>()
        {
            {
                "PARTICLE_IO_PHOTON", new Dictionary<string,int>() {
                    {"D0", 0},
                    {"D1", 1},
                    {"D2", 2},
                    {"D3", 3},
                    {"D4", 4},
                    {"D5", 5},
                    {"D6", 6},
                    {"D7", 7},
                    {"A0", 10},
                    {"A1", 11},
                    {"A2", 12},
                    {"A3", 13},
                    {"A4", 14},
                    {"A5", 15}
                }
            },{
                "ARDUINO_NANO_33_IOT", new Dictionary<string,int>() {
                    {"TX1", 1},
                    {"RX0", 2},
                    {"D2", 5},
                    {"D3", 6},
                    {"D4", 7},
                    {"D5", 8},
                    {"D6", 9},
                    {"D7", 10},
                    {"D8", 11},
                    {"D9", 12},
                    {"D10", 13},
                    {"D11", 14},
                    {"D12", 15},
                    {"A0", 19},
                    {"A1", 20},
                    {"A2", 21},
                    {"A3", 22},
                    {"A4", 23},
                    {"A5", 24},
                    {"A6", 25},
                    {"A7", 26},
                }
            },{
                "ESP_01S", new Dictionary<string,int>() {
                    {"TX", 1},
                    {"RX", 3},
                    {"IO0", 0},
                    {"IO2", 2},
                }
            }
        };
    }
}