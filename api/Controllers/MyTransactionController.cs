using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Swashbuckle.AspNetCore.Annotations;


namespace Homo.IotApi
{
    [Route("v1/my/transaction/{id}")]
    [SwaggerUiInvisibility]
    [IotAuthorizeFactory]
    [Validate]
    public class MyTransactionController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public MyTransactionController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
        }

        [SwaggerOperation(
            Tags = new[] { "使用者相關" },
            Summary = "交易狀態",
            Description = ""
        )]
        [HttpGet]
        public ActionResult<dynamic> get([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            return TransactionDataservice.GetOne(_dbContext, ownerId, id);
        }

    }
}
