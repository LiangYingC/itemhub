using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;
using Swashbuckle.AspNetCore.Annotations;

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

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient Redirect URI - 取得所有 oAuthClient 允許重新導向的網址",
            Description = ""
        )]
        [HttpGet]
        public ActionResult<dynamic> getAll([FromRoute] long oauthClientId, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return OauthClientRedirectUriDataservice.GetAll(_dbContext, extraPayload.Id, oauthClientId);
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient Redirect URI - 批次刪除 oAuthClient Redirect URI",
            Description = ""
        )]
        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            OauthClientRedirectUriDataservice.BatchDelete(_dbContext, extraPayload.Id, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient Redirect URI - 批次建立 oAuthClient Redirect URI",
            Description = ""
        )]
        [HttpPost]
        public ActionResult<dynamic> batchCreate([FromRoute] long oauthClientId, [FromBody] List<string> redirectUris, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return OauthClientRedirectUriDataservice.BatchCreate(_dbContext, extraPayload.Id, oauthClientId, redirectUris);
        }

    }
}
