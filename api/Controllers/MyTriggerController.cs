using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/me/trigger")]
    [Validate]
    public class TriggerController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public TriggerController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.Trigger dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            Trigger rewRecord = TriggerDataservice.Create(_dbContext, extraPayload.Id, dto);
            return rewRecord;
        }

        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            TriggerDataservice.BatchDelete(_dbContext, extraPayload.Id, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
