using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;
using Homo.Core.Helpers;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/me/oauth-clients")]
    [Validate]
    public class OauthClientController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public OauthClientController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] int limit, [FromQuery] int page, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<OauthClient> records = OauthClientDataservice.GetList(_dbContext, ownerId, page, limit);
            return new
            {
                oauthClients = records,
                rowNums = OauthClientDataservice.GetRowNum(_dbContext, ownerId)
            };
        }

        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.OauthClient dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            string clientSecret = CryptographicHelper.GetSpecificLengthRandomString(64, true, false);
            string salt = CryptographicHelper.GetSpecificLengthRandomString(128, false, false);
            string hashClientSecrets = CryptographicHelper.GenerateSaltedHash(clientSecret, salt);
            OauthClient rewRecord = OauthClientDataservice.Create(_dbContext, ownerId, dto, hashClientSecrets, salt);
            return new
            {
                clientSecret
            };
        }

        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClientDataservice.BatchDelete(_dbContext, ownerId, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<dynamic> get([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClient record = OauthClientDataservice.GetOne(_dbContext, ownerId, id);
            if (record == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return record;
        }

        [HttpPatch]
        [Route("{id}")]
        public ActionResult<dynamic> update([FromRoute] int id, [FromBody] DTOs.OauthClient dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClientDataservice.Update(_dbContext, ownerId, id, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClientDataservice.Delete(_dbContext, ownerId, id);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
