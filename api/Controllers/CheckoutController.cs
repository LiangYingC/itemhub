using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.AuthApi;
using Homo.Api;
using Homo.Core.Constants;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Homo.IotApi
{
    [Route("v1/checkout")]
    [AuthorizeFactory()]
    public class CheckoutController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private string _tapPayEndpoint;
        private string _tapPayPartnerKey;
        private string _tapPayMerchantId;
        public CheckoutController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
            _tapPayEndpoint = appSettings.Value.Common.TapPayEndpointByPrime;
            _tapPayPartnerKey = appSettings.Value.Secrets.TapPayPartnerKey;
            _tapPayMerchantId = appSettings.Value.Secrets.TapPayMerchantId;
        }

        [HttpPost]
        [Validate]
        public async Task<dynamic> checkout([FromBody] DTOs.Checkout dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            // avoid duplciate subscribe
            var subscriptionsInDb = SubscriptionDataservice.GetAll(_dbContext, extraPayload.Id, dto.pricingPlan, DateTime.Now); ;
            List<ConvertHelper.EnumList> plans = ConvertHelper.EnumToList(typeof(PRICING_PLAN));
            if (subscriptionsInDb.Count > 0)
            {
                Subscription firstSubscription = subscriptionsInDb[0];
                ConvertHelper.EnumList existstPlan = plans.Find(x => (int)x.Value == firstSubscription.PricingPlan);
                throw new CustomException(ERROR_CODE.DUPLICATE_SUBSCRIBE,
                System.Net.HttpStatusCode.BadRequest,
                new Dictionary<string, string> { { "planName", existstPlan.Label }, { "startAt", firstSubscription.StartAt.ToString("yyyy-MM-dd HH:mm:ss") }, { "endAt", firstSubscription.EndAt.ToString("yyyy-MM-dd HH:mm:ss") } });
            }

            // prepare Tappay request data
            int amount = (int)SubscriptionHelper.GetPrice(dto.pricingPlan);
            // 照比例算價格
            DateTime startOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            int daysInMonth = System.DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month);
            DateTime endOfMonth = startOfMonth.AddDays(daysInMonth - 1).AddHours(23).AddMinutes(59).AddSeconds(59);
            int infactAmount = (int)Math.Round((decimal)amount * (endOfMonth - DateTime.Now).Days / daysInMonth);
            string planName = plans.Find(x => (int)x.Value == (int)dto.pricingPlan).Label;
            var postBody = new
            {
                prime = dto.prime,
                partner_key = _tapPayPartnerKey,
                merchant_id = _tapPayMerchantId,
                amount = infactAmount,
                details = planName,
                cardholder = new { name = dto.name, email = dto.email, phone_number = dto.phone },
                remember = true
            };
            StringContent stringContent = new StringContent(JsonConvert.SerializeObject(postBody), System.Text.Encoding.UTF8, "application/json");
            HttpClient http = new HttpClient();
            http.DefaultRequestHeaders.Add("x-api-key", _tapPayPartnerKey);
            HttpResponseMessage responseStream = await http.PostAsync(_tapPayEndpoint, stringContent);
            string result = "";
            using (var sr = new System.IO.StreamReader(await responseStream.Content.ReadAsStreamAsync(), System.Text.Encoding.UTF8))
            {
                result = sr.ReadToEnd();
            }
            DTOs.TapPayResponse response = Newtonsoft.Json.JsonConvert.DeserializeObject<DTOs.TapPayResponse>(result);

            // create transaction log and remove senstive information 
            var withoutSenstiveInfoResponse = JsonConvert.DeserializeObject<IDictionary<string, dynamic>>(JsonConvert.SerializeObject(response));
            withoutSenstiveInfoResponse.Remove("card_secret");
            Transaction transaction = TransactionDataservice.Create(_dbContext, new DTOs.Transaction()
            {
                Raw = JsonConvert.SerializeObject(withoutSenstiveInfoResponse),
                OwnerId = extraPayload.Id
            });

            // create user subscriont log
            if (response.status == DTOs.TAP_PAY_TRANSACTION_STATUS.OK)
            {
                SubscriptionDataservice.Create(_dbContext, new DTOs.Subscription()
                {
                    OwnerId = extraPayload.Id,
                    StartAt = System.DateTime.Now,
                    EndAt = endOfMonth,
                    PricingPlan = dto.pricingPlan,
                    TransactionId = transaction.Id,
                    CardKey = response.card_secret.card_key,
                    CardToken = response.card_secret.card_token,
                });
                return new { Status = CUSTOM_RESPONSE.OK, Amount = infactAmount };
            }
            else
            {
                throw new CustomException(ERROR_CODE.TAPPAY_TRANSACTION_ERROR, System.Net.HttpStatusCode.InternalServerError, new Dictionary<string, string>() { { "message", response.msg ?? response.bank_result_msg } });
            }
        }
    }
}