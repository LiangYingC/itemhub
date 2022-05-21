using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [Route("v1/my/oauth-clients/{oauthClientId}/redirect-uris")]
    [IotDashboardAuthorizeFactory]
    [Validate]
    public class OauthClientRedirectUriController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public OauthClientRedirectUriController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getAll([FromRoute] long oauthClientId, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return OauthClientRedirectUriDataservice.GetAll(_dbContext, extraPayload.Id, oauthClientId);
        }

        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            OauthClientRedirectUriDataservice.BatchDelete(_dbContext, extraPayload.Id, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpPost]
        public ActionResult<dynamic> batchCreate([FromRoute] long oauthClientId, [FromBody] List<string> redirectUris, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return OauthClientRedirectUriDataservice.BatchCreate(_dbContext, extraPayload.Id, oauthClientId, redirectUris);
        }

    }
}
