using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.Core.Constants;
using System.Linq;


namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/my/subscription")]
    [Validate]
    public class MySubscriptionController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;
        public MySubscriptionController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
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
