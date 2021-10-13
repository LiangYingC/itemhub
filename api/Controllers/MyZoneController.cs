using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.Core.Constants;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/me/zones")]
    [Validate]
    public class MyZoneController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        public MyZoneController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] int limit, [FromQuery] int page, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            List<Zone> records = ZoneDataservice.GetList(_dbContext, extraPayload.Id, page, limit);
            return new
            {
                zones = records,
                rowNums = ZoneDataservice.GetRowNum(_dbContext, extraPayload.Id)
            };
        }

        [HttpGet]
        [Route("all")]
        public ActionResult<dynamic> getAll(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            return ZoneDataservice.GetAll(_dbContext, extraPayload.Id);
        }

        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.Zone dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            Zone rewRecord = ZoneDataservice.Create(_dbContext, extraPayload.Id, dto);
            return rewRecord;
        }

        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            ZoneDataservice.BatchDelete(_dbContext, extraPayload.Id, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

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

        [HttpPatch]
        [Route("{id}")]
        public ActionResult<dynamic> update([FromRoute] int id, [FromBody] DTOs.Zone dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            ZoneDataservice.Update(_dbContext, extraPayload.Id, id, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            ZoneDataservice.Delete(_dbContext, extraPayload.Id, id);
            return new { status = CUSTOM_RESPONSE.OK };
        }

    }
}
