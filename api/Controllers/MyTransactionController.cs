using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.Core.Constants;
using System.Linq;

namespace Homo.IotApi
{
    [Route("v1/my/transaction/{id}")]
    [SwaggerUiInvisibility]
    [IotAuthorizeFactory]
    [Validate]
    public class MyTransactionController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;

        public MyTransactionController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> get([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            return TransactionDataservice.GetOne(_dbContext, ownerId, id); ;
        }

    }
}
