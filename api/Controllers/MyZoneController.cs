using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.IotApi
{
    [Route("v1/my/zones")]
    [SwaggerUiInvisibility]
    [IotAuthorizeFactory]
    [Validate]
    public class MyZoneController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public MyZoneController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 取得區域分頁列表",
            Description = ""
        )]
        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] int limit, [FromQuery] int page, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            List<Zone> records = ZoneDataservice.GetList(_dbContext, extraPayload.Id, page, limit);
            return new
            {
                zones = records,
                rowNum = ZoneDataservice.GetRowNum(_dbContext, extraPayload.Id)
            };
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 取得區域",
            Description = ""
        )]
        [HttpGet]
        [Route("all")]
        public ActionResult<dynamic> getAll(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return ZoneDataservice.GetAll(_dbContext, extraPayload.Id);
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 建立區域",
            Description = ""
        )]
        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.ZonePayload dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            Zone rewRecord = ZoneDataservice.Create(_dbContext, extraPayload.Id, dto);
            return rewRecord;
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 批次刪除區域",
            Description = ""
        )]
        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            ZoneDataservice.BatchDelete(_dbContext, extraPayload.Id, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 取得單一區域資料",
            Description = ""
        )]
        [HttpGet]
        [Route("{id}")]
        public ActionResult<dynamic> get([FromRoute] int id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            Zone record = ZoneDataservice.GetOne(_dbContext, extraPayload.Id, id);
            if (record == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return record;
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 更新單一區域",
            Description = ""
        )]
        [HttpPatch]
        [Route("{id}")]
        public ActionResult<dynamic> update([FromRoute] int id, [FromBody] DTOs.ZonePayload dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            ZoneDataservice.Update(_dbContext, extraPayload.Id, id, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "Beta" },
            Summary = "區域 - 刪除單一區域",
            Description = ""
        )]
        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            ZoneDataservice.Delete(_dbContext, extraPayload.Id, id);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
