namespace Homo.IotApi
{
    public abstract partial class DTOs
    {
        public partial class TapPayResponse : DTOs
        {

            public TAP_PAY_TRANSACTION_STATUS status { get; set; }
            public string msg { get; set; }

            public string rec_trade_id { get; set; }
            public string bank_transaction_id { get; set; }
            public string bank_order_number { get; set; }
            public CardSecret card_secret { get; set; }
            public int amount { get; set; }
            public string currency { get; set; }
            public dynamic card_info { get; set; }
            public string order_number { get; set; }
            public string acquirer { get; set; }
            public long transaction_time_millis { get; set; }
            public dynamic bank_transaction_time { get; set; }
            public string bank_result_code { get; set; }
            public string bank_result_msg { get; set; }
            public string payment_url { get; set; }
            public dynamic instalment_info { get; set; }
            public dynamic redeem_info { get; set; }

            public string card_identifier { get; set; }
            public dynamic merchant_reference_info { get; set; }
            public string event_code { get; set; }
            public bool is_rba_verified { get; set; }
            public dynamic transaction_method_details { get; set; }
        }

        public partial class TapPayNotify : DTOs
        {
            public string rec_trade_id { get; set; }
            public int status { get; set; }
            public string auth_code { get; set; }
            public string bank_transaction_id { get; set; }
            public string bank_order_number { get; set; }
            public string order_number { get; set; }
            public int amount { get; set; }
            public string msg { get; set; }
            public long transaction_time_millis { get; set; }
            public dynamic pay_info { get; set; }
            public dynamic e_invoice_carrier { get; set; }
            public string acquirer { get; set; }
            public string card_identifier { get; set; }
            public string bank_result_code { get; set; }
            public string bank_result_msg { get; set; }
            public dynamic merchant_reference_info { get; set; }
            public dynamic instalment_info { get; set; }
            public dynamic redeem_info { get; set; }
            public string event_code { get; set; }
            public dynamic merchandise_details { get; set; }
        }

        public partial class CardSecret
        {
            public string card_token { get; set; }
            public string card_key { get; set; }
        }

        public enum TAP_PAY_TRANSACTION_STATUS
        {
            OK,
            EMPTY,
            ERROR,
            TYPEING
        }
    }
}
