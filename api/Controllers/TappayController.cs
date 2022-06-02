using Swashbuckle.AspNetCore.Annotations;
using api.Constants;
using api.Helpers;
using Homo.Api;
using Homo.AuthApi;
using Homo.Core.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Homo.IotApi
{
    [Route("v1/tappay")]
    [SwaggerUiInvisibility]
    [Validate]
    public class TappayController : ControllerBase
    {
        private readonly Homo.Api.CommonLocalizer _commonLocalizer;
        private readonly IotDbContext _dbContext;
        private readonly string _systemEmail;
        private readonly string _adminEmail;
        private readonly string _sendGridApiKey;
        private readonly string _websiteUrl;
        private readonly string _staticPath;
        public TappayController(IotDbContext dbContext, IOptions<AppSettings> appSettings, Homo.Api.CommonLocalizer commonLocalizer)
        {
            _commonLocalizer = commonLocalizer;
            _dbContext = dbContext;
            _systemEmail = appSettings.Value.Common.SystemEmail;
            _adminEmail = appSettings.Value.Common.AdminEmail;
            _sendGridApiKey = appSettings.Value.Secrets.SendGridApiKey;
            _websiteUrl = appSettings.Value.Common.WebsiteUrl;
            _staticPath = appSettings.Value.Common.StaticPath;
        }

        [SwaggerOperation(
            Tags = new[] { "金流" },
            Summary = "Tappay 更新金流狀態",
            Description = ""
        )]
        [HttpPost]
        public ActionResult<dynamic> updateTransactionByTappay([FromBody] DTOs.TapPayNotify originalDto)
        {
            System.Console.WriteLine($"testing:{Newtonsoft.Json.JsonConvert.SerializeObject(originalDto, Newtonsoft.Json.Formatting.Indented)}");
            DTOs.TapPayNotify dto = Newtonsoft.Json.JsonConvert.DeserializeObject<DTOs.TapPayNotify>(Newtonsoft.Json.JsonConvert.SerializeObject(originalDto));
            ThirdPartyPaymentFlowDataservice.Create(_dbContext, new DTOs.ThirdPartyPaymentFlow()
            {
                ExternalTransactionId = dto.rec_trade_id,
                Raw = Newtonsoft.Json.JsonConvert.SerializeObject(dto)
            });
            var transaction = TransactionDataservice.GetOneByExternalId(_dbContext, dto.rec_trade_id);
            var subscription = SubscriptionDataservice.GetOneByTransactionId(_dbContext, transaction.OwnerId, transaction.Id);
            var newTransactionStatus = TRANSACTION_STATUS.PENDING;
            if (dto.status == 0)
            {
                // 發信給管理員
                MailTemplate template = MailTemplateHelper.Get(MAIL_TEMPLATE.NEW_PREIUM_USER, _staticPath);
                template = MailTemplateHelper.ReplaceVariable(template, new
                {
                    websiteUrl = _websiteUrl,
                    adminEmail = _adminEmail,
                    hello = _commonLocalizer.Get("hello"),
                    amount = dto.amount,
                    mailContentGetNewPremiumUser = _commonLocalizer.Get("mailContentGetNewPremiumUser"),
                    mailContentSystemAutoSendEmail = _commonLocalizer.Get("mailContentSystemAutoSendEmail")
                });

                MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
                {
                    Subject = _commonLocalizer.Get(template.Subject),
                    Content = template.Content
                }, _systemEmail, _adminEmail, _sendGridApiKey);

                newTransactionStatus = TRANSACTION_STATUS.PAID;
            }
            else
            {
                newTransactionStatus = TRANSACTION_STATUS.ERROR;
            }

            TransactionDataservice.UpdateStatus(_dbContext, transaction, newTransactionStatus);
            SubscriptionDataservice.UpdateStatus(_dbContext, subscription, newTransactionStatus == TRANSACTION_STATUS.PAID ? SUBSCRIPTION_STATUS.PAID : SUBSCRIPTION_STATUS.PENDING);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}