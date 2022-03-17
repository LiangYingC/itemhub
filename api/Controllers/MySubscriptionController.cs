using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.AuthApi;
using Homo.Core.Constants;
using System.Threading.Tasks;


namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/my/subscription")]
    [Validate]
    public class MySubscriptionController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _systemEmail;
        private readonly string _dbConnectionString;
        private readonly string _sendGridApiKey;
        public MySubscriptionController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
            _systemEmail = appSettings.Value.Common.SystemEmail;
            _sendGridApiKey = appSettings.Value.Secrets.SendGridApiKey;
        }

        [HttpGet]
        public ActionResult<dynamic> getMyCurrentSubscription(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            var subscription = SubscriptionDataservice.GetOne(_dbContext, ownerId);
            if (subscription == null)
            {
                throw new CustomException(ERROR_CODE.NO_SUBSCRIPTION, System.Net.HttpStatusCode.NotFound);
            }

            Transaction trans = null;
            if (subscription.TransactionId != null)
            {
                trans = TransactionDataservice.GetOne(_dbContext, ownerId, subscription.TransactionId.GetValueOrDefault());
            }

            return new
            {
                subscription.EndAt,
                subscription.StartAt,
                subscription.OwnerId,
                subscription.PricingPlan,
                subscription.StopNextSubscribed,
                trans?.Amount
            };
        }

        [HttpDelete]
        public ActionResult<dynamic> cancelSubscription(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            var subscription = SubscriptionDataservice.GetOne(_dbContext, ownerId);
            SubscriptionDataservice.CancelSubscription(_dbContext, ownerId);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpGet]
        [Route("by-transaction-id/{transactionId}")]
        public ActionResult<dynamic> getOneByTransactionId([FromRoute] long transactionId, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            return SubscriptionDataservice.GetOneByTransactionId(_dbContext, ownerId, transactionId);
        }

    }
}
