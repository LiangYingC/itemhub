using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.AuthApi;
using Homo.Core.Constants;
using System.Linq;
using System.Threading.Tasks;
using Homo.Core.Helpers;


namespace Homo.IotApi
{
    [Route("v1/tappay")]
    [SwaggerUiInvisibility]
    [Validate]
    public class TappayController : ControllerBase
    {
        private readonly Homo.Api.CommonLocalizer _commonLocalizer;
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;
        private readonly string _systemEmail;
        private readonly string _adminEmail;
        private readonly string _sendGridApiKey;
        public TappayController(IotDbContext dbContext, IOptions<AppSettings> appSettings, Homo.Api.CommonLocalizer commonLocalizer)
        {
            _commonLocalizer = commonLocalizer;
            _dbContext = dbContext;
            _systemEmail = appSettings.Value.Common.SystemEmail;
            _adminEmail = appSettings.Value.Common.AdminEmail;
            _sendGridApiKey = appSettings.Value.Secrets.SendGridApiKey;
        }

        [HttpPost]
        public ActionResult<dynamic> updateTransactionByTappay(DTOs.TapPayNotify dto)
        {
            ThirdPartyPaymentFlowDataservice.Create(_dbContext, new DTOs.ThirdPartyPaymentFlow()
            {
                ExternalTransactionId = dto.rec_trade_id,
                Raw = Newtonsoft.Json.JsonConvert.SerializeObject(dto)
            });
            var transaction = TransactionDataservice.GetOneByExternalId(_dbContext, dto.rec_trade_id);
            if (dto.status == 0)
            {
                // 發信給管理員
                MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
                {
                    Subject = _commonLocalizer.Get("get new premium user"),
                    Content = _commonLocalizer.Get("premium amount", null, new Dictionary<string, string>() {
                    { "amount", $"{dto.amount}" }
                })
                }, _systemEmail, _adminEmail, _sendGridApiKey);

                transaction.Status = TRANSACTION_STATUS.PAID;
            }
            else
            {
                transaction.Status = TRANSACTION_STATUS.ERROR;
            }
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
