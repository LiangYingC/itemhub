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
    [Route("v1/my/transaction/{id}")]
    [SwaggerUiInvisibility]
    [IotAuthorizeFactory]
    [Validate]
    public class MyTransactionController : ControllerBase
    {
        private readonly Homo.Api.CommonLocalizer _commonLocalizer;
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;
        private readonly string _systemEmail;
        private readonly string _adminEmail;
        private readonly string _sendGridApiKey;
        public MyTransactionController(IotDbContext dbContext, IOptions<AppSettings> appSettings, Homo.Api.CommonLocalizer commonLocalizer)
        {
            _commonLocalizer = commonLocalizer;
            _dbContext = dbContext;
            _systemEmail = appSettings.Value.Common.SystemEmail;
            _adminEmail = appSettings.Value.Common.AdminEmail;
            _sendGridApiKey = appSettings.Value.Secrets.SendGridApiKey;
        }

        [HttpGet]
        public ActionResult<dynamic> get([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            Transaction result = TransactionDataservice.GetOne(_dbContext, ownerId, id);
            // tappay 回傳確認付款成功後，發信給管理員
            // 主要是其中一個管理員看到有付費會員會覺得開心，想要自爽用的
            if (result.Status == TRANSACTION_STATUS.PAID)
            {
                MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
                {
                    Subject = _commonLocalizer.Get("get new premium user"),
                    Content = _commonLocalizer.Get("premium user id", null, new Dictionary<string, string>() {
                    { "userId", $"{extraPayload.Id}" }
                })
                }, _systemEmail, _adminEmail, _sendGridApiKey);
            }

            return result;
        }

    }
}
