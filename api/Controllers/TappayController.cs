using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.Core.Constants;
using System.Linq;


namespace Homo.IotApi
{
    [Route("v1/tappay")]
    [Validate]
    public class TappayController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;
        public TappayController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
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
