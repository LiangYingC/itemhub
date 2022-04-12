using System.ComponentModel;
using Homo.AuthApi;

namespace Homo.IotApi
{
    public enum SEND_OVER_PLAN_NOTIFICATION_FREQUENCY
    {
        [Description("0 次")]
        NONE = 0,
        [Description("1 次")]
        FIRST = 1,
        [Description("2 次")]
        SECOND = 1,
        [Description("3 次")]
        THIRD = 2,
        [Description("4 次")]
        FOURTH = 3,
        [Description("5 次")]
        FIVETH = 5,
        [Description("6 次")]
        SIXTH = 8,
        [Description("7 次")]
        SEVENTH = 13
    }
}