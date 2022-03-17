using System.ComponentModel;
using Homo.AuthApi;

namespace Homo.IotApi
{
    public enum INVOICE_TYPES
    {
        [Description("ItemHub 會員載具")]
        CLOUD_INVOICE,
        [Description("三聯式紙本發票")]
        TRIPLE_INVOICE
    }
}