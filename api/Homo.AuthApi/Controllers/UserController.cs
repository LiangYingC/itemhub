using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Homo.Core.Constants;

namespace Homo.AuthApi
{
    [Route("v1/users")]
    [AuthorizeFactory(AUTH_TYPE.COMMON, new ROLE[] { ROLE.USER })]
    public class UserController : ControllerBase
    {

        private readonly DBContext _dbContext;
        public UserController(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] string email, [FromQuery] string ids, [FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            List<long> userIds = ids == null ? null : ids.Split(",").Select(x =>
            {
                long test = 0;
                long.TryParse(x, out test);
                return test;
            }).ToList<long>();
            List<User> records = UserDataservice.GetList(_dbContext, page, limit, email, userIds);
            return new
            {
                users = records,
                rowNums = UserDataservice.GetRowNums(_dbContext, email, userIds)
            };
        }

        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, DTOs.JwtExtraPayload extraPayload)
        {
            long editedBy = extraPayload.Id;
            UserDataservice.BatchDelete(_dbContext, editedBy, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<dynamic> get([FromRoute] int id)
        {
            User record = UserDataservice.GetOne(_dbContext, id);
            if (record == null)
            {
                throw new CustomException(ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return record;
        }

        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, DTOs.JwtExtraPayload extraPayload)
        {
            long editedBy = extraPayload.Id;
            UserDataservice.Delete(_dbContext, id, editedBy);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
