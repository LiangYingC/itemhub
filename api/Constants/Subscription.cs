using System.ComponentModel;
using Homo.AuthApi;

namespace Homo.IotApi
{
    public enum SUBSCRIPTION_STATUS
    {
        [Description("未付費")]
        PENDING,
        [Description("已付費")]
        PAID
    }
}