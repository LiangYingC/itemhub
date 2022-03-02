using System.ComponentModel;
using Homo.AuthApi;

namespace Homo.IotApi
{
    public enum PRICING_PLAN
    {
        [Description("免費")]
        FREE,
        [Description("基礎")]
        BASIC,
        [Description("進階")]
        ADVANCE,
        [Description("Growth")]
        GROWTH,
        [Description("Small Business")]
        SMALL_BUSINESS
    }
}