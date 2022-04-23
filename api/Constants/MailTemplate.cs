using System.ComponentModel;
namespace api.Constants
{
    public enum MAIL_TEMPLATE
    {
        [Description("驗證信箱")]
        VERIFY_EMAIL = 0,

        [Description("兩步驟驗證")]
        TWO_FACTOR_AUTH = 1,

        [Description("重設密碼")]
        RESET_PASSWORD = 2,

        [Description("用量超過訂閱方案")]
        OVER_SUBSCRIPTION = 3,

        [Description("聯絡我們")]
        CONTACT_US = 4,

        [Description("早鳥會員註冊")]
        EARLY_BIRD_REGISTER = 5,

        [Description("新付費會員")]
        NEW_PREIUM_USER = 6,
    }
}