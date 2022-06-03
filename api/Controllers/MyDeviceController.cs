using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Homo.Api;
using Homo.Core.Constants;
using Homo.AuthApi;
using Swashbuckle.AspNetCore.Annotations;

namespace Homo.IotApi
{
    [Route("v1/my/devices")]
    [IotDashboardAuthorizeFactory]
    [Validate]
    public class MyDeviceController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _dbConnectionString;
        private readonly Homo.Api.CommonLocalizer _commonLocalizer;
        private readonly string _adminEmail;
        public MyDeviceController(IotDbContext dbContext, IOptions<AppSettings> appSettings, Homo.Api.CommonLocalizer commonLocalizer)
        {
            _dbContext = dbContext;
            _dbConnectionString = appSettings.Value.Secrets.DBConnectionString;
            _commonLocalizer = commonLocalizer;
            _adminEmail = appSettings.Value.Common.AdminEmail;

        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 取得分頁列表",
            Description = ""
        )]
        [HttpGet]
        public ActionResult<dynamic> getList([FromQuery] int limit, [FromQuery] int page, [FromQuery] string name, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            List<Device> records = DeviceDataservice.GetList(_dbContext, ownerId, page, limit, name);
            return new
            {
                devices = records,
                rowNum = DeviceDataservice.GetRowNum(_dbContext, ownerId, name)
            };
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 取得列表",
            Description = ""
        )]
        [HttpGet]
        [Route("all")]
        public ActionResult<dynamic> getAll(Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            return DeviceDataservice.GetAll(_dbContext, ownerId);
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 建立新裝置",
            Description = ""
        )]
        [HttpPost]
        public ActionResult<dynamic> create([FromBody] DTOs.DevicePayload dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            Subscription subscription = SubscriptionDataservice.GetCurrnetOne(_dbContext, ownerId);
            int subscriptionLevel = subscription == null ? -1 : subscription.PricingPlan;
            decimal deviceCountInPricingPlan = subscriptionLevel == -1 ? 2 : SubscriptionHelper.GetDeviceCount((PRICING_PLAN)subscription.PricingPlan);
            decimal currentDeviceCount = DeviceDataservice.GetRowNum(_dbContext, ownerId, null);

            if (currentDeviceCount + 1 > deviceCountInPricingPlan)
            {
                var pricingPlans = ConvertHelper.EnumToList(typeof(PRICING_PLAN));
                string reason = "";
                if (subscriptionLevel + 1 > pricingPlans.Count - 1)
                {
                    reason = _commonLocalizer.Get("moreThanMaxNumberOfDeviceInAnyPlan", null, new Dictionary<string, string>() { { "adminEmail", _adminEmail } });
                }
                else
                {
                    decimal deviceCountInNextLevelPricingPlan = SubscriptionHelper.GetDeviceCount((PRICING_PLAN)(subscriptionLevel + 1));
                    reason = _commonLocalizer.Get("moreThanMaxNumberOfDevice", null, new Dictionary<string, string>() { { "deviceCountInNextLevelPricingPlan", deviceCountInNextLevelPricingPlan.ToString() } });
                }

                throw new CustomException(ERROR_CODE.OVER_PRICING_PLAN, System.Net.HttpStatusCode.Forbidden, new Dictionary<string, string>(){{
                    "reason", reason
                }});
            }

            Device rewRecord = DeviceDataservice.Create(_dbContext, ownerId, dto);
            return rewRecord;
        }


        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 批次刪除裝置",
            Description = ""
        )]
        [HttpDelete]
        public ActionResult<dynamic> batchDelete([FromBody] List<long> ids, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            DeviceDataservice.BatchDelete(_dbContext, ownerId, ids);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 取得單一裝置",
            Description = ""
        )]
        [HttpGet]
        [Route("{id}")]
        public ActionResult<dynamic> getOne([FromRoute] int id, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            Device record = DeviceDataservice.GetOne(_dbContext, ownerId, id);
            if (record == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return record;
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 經由裝置號碼取得單一裝置",
            Description = ""
        )]
        [HttpGet]
        [Route("by-device-id/{deviceId}")]
        public ActionResult<dynamic> getOneByDeviceId([FromRoute] string deviceId, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            long ownerId = extraPayload.Id;
            Device record = DeviceDataservice.GetOneByDeviceId(_dbContext, ownerId, deviceId);
            if (record == null)
            {
                throw new CustomException(Homo.AuthApi.ERROR_CODE.DATA_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }
            return record;
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 更新單一裝置基本資料",
            Description = ""
        )]
        [HttpPatch]
        [Route("{id}")]
        public ActionResult<dynamic> update([FromRoute] int id, [FromBody] DTOs.DevicePayload dto, dynamic extraPayload)
        {
            long ownerId = extraPayload.Id;
            DeviceDataservice.Update(_dbContext, ownerId, id, dto);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 刪除單一裝置",
            Description = ""
        )]
        [HttpDelete]
        [Route("{id}")]
        public ActionResult<dynamic> delete([FromRoute] long id, dynamic extraPayload)
        {
            long ownerId = extraPayload.Id;
            DeviceDataservice.Delete(_dbContext, ownerId, id);
            return new { status = CUSTOM_RESPONSE.OK };
        }

        [SwaggerOperation(
            Tags = new[] { "裝置相關" },
            Summary = "裝置 - 切換裝置狀態",
            Description = ""
        )]
        [HttpPost]
        [Route("{id}/online")]
        public ActionResult<dynamic> online([FromRoute] long id, dynamic extraPayload)
        {
            long ownerId = extraPayload.Id;
            DeviceDataservice.Switch(_dbContext, ownerId, id, true);
            DeviceActivityLogDataservice.Create(_dbContext, ownerId, id);
            TimeoutOfflineDeviceService.StartAsync(ownerId, id, _dbConnectionString);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
