using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;
using Homo.Core.Helpers;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.IotApi
{
    [Route("v1/my/oauth-clients")]
    [IotDashboardAuthorizeFactory]
    [Validate]
    public class OauthClientController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public OauthClientController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 取得 oAuthClient 分頁列表",
            Description = ""
        )]
        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] int limit, [FromQuery] int page, [FromQuery] bool isDeviceClient, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<OauthClient> records = OauthClientDataservice.GetList(_dbContext, ownerId, isDeviceClient, null, page, limit);
            return new
            {
                oauthClients = records,
                rowNum = OauthClientDataservice.GetRowNum(_dbContext, ownerId, isDeviceClient, null)
            };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 建立 oAuthClient",
            Description = ""
        )]
        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.OauthClient dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            if (dto.ClientId == null || dto.ClientId == "")
            {
                dto.ClientId = CryptographicHelper.GetSpecificLengthRandomString(64, true);
            }
            OauthClient client = OauthClientDataservice.GetOneByClientId(_dbContext, dto.ClientId);
            if (client != null)
            {
                throw new CustomException(ERROR_CODE.DUPLICATE_OAUTH_CLIENT_ID, System.Net.HttpStatusCode.BadRequest);
            }

            if (dto.DeviceId != null)
            {
                OauthClient clientFromDeviceId = OauthClientDataservice.GetOneByDeviceId(_dbContext, extraPayload.Id, dto.DeviceId.GetValueOrDefault());
                if (clientFromDeviceId != null)
                {
                    throw new CustomException(ERROR_CODE.DUPLICATE_OAUTH_CLIENT_ID, System.Net.HttpStatusCode.BadRequest);
                }
            }


            string clientSecret = CryptographicHelper.GetSpecificLengthRandomString(64, true, false);
            string salt = CryptographicHelper.GetSpecificLengthRandomString(128, false, false);
            string hashClientSecrets = CryptographicHelper.GenerateSaltedHash(clientSecret, salt);
            OauthClient newRecord = OauthClientDataservice.Create(_dbContext, ownerId, dto, hashClientSecrets, salt);
            return new
            {
                Id = newRecord.Id,
                OwnerId = newRecord.OwnerId,
                ClientId = newRecord.ClientId,
                DeviceId = newRecord.DeviceId,
                ClientSecrets = clientSecret
            };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 批次刪除 oAuthClient",
            Description = ""
        )]
        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClientDataservice.BatchDelete(_dbContext, ownerId, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 取得單一 oAuthClient 資料",
            Description = ""
        )]
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
            return new
            {
                Id = record.Id,
                OwnerId = record.OwnerId,
                ClientId = record.ClientId,
                DeviceId = record.DeviceId
            }; ;
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 更新單一 oAuthClient 資料",
            Description = ""
        )]
        [HttpPatch]
        [Route("{id}")]
        public ActionResult<dynamic> update([FromRoute] int id, [FromBody] DTOs.OauthClient dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClientDataservice.Update(_dbContext, ownerId, id, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 取得新的 oAuthClient Secret",
            Description = ""
        )]
        [HttpPost]
        [Route("{id}/revoke-secret")]
        public ActionResult<dynamic> revokeSecret([FromRoute] int id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            string clientSecret = CryptographicHelper.GetSpecificLengthRandomString(64, true, false);
            string salt = CryptographicHelper.GetSpecificLengthRandomString(128, false, false);
            string hashClientSecrets = CryptographicHelper.GenerateSaltedHash(clientSecret, salt);
            OauthClientDataservice.RevokeSecret(_dbContext, ownerId, id, hashClientSecrets, salt);
            return new { secret = clientSecret };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 刪除單一 oAuthClient",
            Description = ""
        )]
        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClientDataservice.Delete(_dbContext, ownerId, id);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "oAuth" },
            Summary = "oAuthClient - 透過裝置 ID 取得單一 oAuthClient 資料",
            Description = ""
        )]
        [HttpGet]
        [Route("by-device-id/{deviceId}")]
        public ActionResult<dynamic> getOneByDeviceId([FromRoute] long deviceId, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            OauthClient record = OauthClientDataservice.GetOneByDeviceId(_dbContext, ownerId, deviceId);
            if (record == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return new
            {
                Id = record.Id,
                OwnerId = record.OwnerId,
                ClientId = record.ClientId,
                DeviceId = record.DeviceId,
            };
        }

    }
}
