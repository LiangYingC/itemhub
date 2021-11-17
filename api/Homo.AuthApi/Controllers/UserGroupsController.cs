using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Homo.Core.Constants;

namespace Homo.AuthApi
{
    [Route("v1/users/{id}/groups")]
    [AuthorizeFactory(AUTH_TYPE.COMMON, new ROLE[] { ROLE.USER })]
    public class UserGroupsController : ControllerBase
    {

        private readonly DBContext _dbContext;
        public UserGroupsController(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<dynamic> getAll([FromRoute] long id)
        {
            return RelationOfGroupAndUserDataservice.GetRelationByUserId(_dbContext, id);
        }

        [HttpPatch]
        public ActionResult<dynamic> updateGroups([FromRoute] long id, [FromBody] List<long> groupIds, DTOs.JwtExtraPayload extraPayload)
        {
            long editedBy = extraPayload.Id;
            List<ViewRelationOfGroupAndUser> existsPermissionGroups = RelationOfGroupAndUserDataservice.GetRelationByUserId(_dbContext, id);

            List<long> exitsIds = existsPermissionGroups.Select(x => x.GroupId).ToList<long>();
            List<long> shouldBeDeletedIds = existsPermissionGroups.Where(x => !groupIds.Contains(x.GroupId)).Select(x => x.Id).ToList();
            List<long> shouldBeAddedGroupIds = groupIds.Where(x => !exitsIds.Contains(x)).ToList();
            RelationOfGroupAndUserDataservice.AddPermissionGroups(editedBy, id, shouldBeAddedGroupIds, _dbContext);
            RelationOfGroupAndUserDataservice.DeletePermissionGroups(editedBy, id, shouldBeDeletedIds, _dbContext);
            return new { result = CUSTOM_RESPONSE.OK.ToString() };
        }

    }
}
