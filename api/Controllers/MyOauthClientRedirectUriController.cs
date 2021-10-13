using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/me/oauth-client-redirect-uris")]
    [Validate]
    public class OauthClientRedirectUriController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public OauthClientRedirectUriController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] int limit, [FromQuery] int page, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            List<OauthClientRedirectUri> records = OauthClientRedirectUriDataservice.GetList(_dbContext, extraPayload.Id, page, limit);
            return new
            {
                oauthClientRedirectUris = records,
                rowNums = OauthClientRedirectUriDataservice.GetRowNum(_dbContext, extraPayload.Id)
            };
        }

        [HttpGet]
        [Route("all")]
        public ActionResult<dynamic> getAll(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return OauthClientRedirectUriDataservice.GetAll(_dbContext, extraPayload.Id);
        }

        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.OauthClientRedirectUri dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            OauthClientRedirectUri rewRecord = OauthClientRedirectUriDataservice.Create(_dbContext, extraPayload.Id, dto);
            return rewRecord;
        }

        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            OauthClientRedirectUriDataservice.BatchDelete(_dbContext, extraPayload.Id, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<dynamic> get([FromRoute] int id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            OauthClientRedirectUri record = OauthClientRedirectUriDataservice.GetOne(_dbContext, extraPayload.Id, id);
            if (record == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return record;
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            OauthClientRedirectUriDataservice.Delete(_dbContext, extraPayload.Id, id);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
