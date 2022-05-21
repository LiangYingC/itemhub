using Microsoft.AspNetCore.Mvc;
using Homo.AuthApi;
using Homo.Api;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Homo.IotApi
{
    [Route("v1/universal")]
    [SwaggerUiInvisibility]
    public class IotUniversalController : ControllerBase
    {

        private readonly IotDbContext _dbContext;
        public IotUniversalController(IotDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("pricing-plans")]
        public ActionResult<dynamic> getPricingPlans()
        {
            List<dynamic> pricingPlans = ConvertHelper.EnumToList(typeof(PRICING_PLAN)).Select(x =>
            new
            {
                x.Key,
                x.Value,
                x.Label,
                Price = SubscriptionHelper.GetPrice((PRICING_PLAN)x.Value),
                DeviceCount = SubscriptionHelper.GetDeviceCount((PRICING_PLAN)x.Value),
                Frequency = SubscriptionHelper.GetFrequency((PRICING_PLAN)x.Value),
                StorageTime = SubscriptionHelper.GetStorageTime((PRICING_PLAN)x.Value),
            }).ToList<dynamic>();

            return pricingPlans;
        }

        [HttpGet]
        [Route("invoice-types")]
        public ActionResult<dynamic> getInvoiceTypes()
        {
            List<dynamic> invoice = ConvertHelper.EnumToList(typeof(INVOICE_TYPES)).Select(x =>
            new
            {
                x.Key,
                x.Value,
                x.Label
            }).ToList<dynamic>();

            return invoice;
        }

        [HttpGet]
        [Route("trigger-operators")]
        public ActionResult<dynamic> getTriggerOperators()
        {
            List<ConvertHelper.EnumList> triggerOperators= ConvertHelper.EnumToList(typeof(TRIGGER_OPERATOR));
            Dictionary<string, string> symbolMapping = new Dictionary<string, string>() { { "B", ">" }, { "BE", ">=" }, { "E", "=" }, { "LE", "<=" }, { "L", "<" } };
            return triggerOperators.Select(x => new
            {
                x.Key,
                x.Label,
                x.Value,
                Symbol = symbolMapping.GetValueOrDefault(x.Key)
            }).ToList<dynamic>();
        }

        [HttpGet]
        [Route("transaction-status")]
        public ActionResult<dynamic> getTransactionStatus()
        {
            return ConvertHelper.EnumToList(typeof(TRANSACTION_STATUS));
        }

        [HttpGet]
        [Route("microcontroller")]
        public ActionResult<dynamic> getMicrocontroller()
        {
            return _dbContext.Microcontroller.Select(x => new
            {
                x.Id,
                x.Key,
                Pins = Newtonsoft.Json.JsonConvert.DeserializeObject<List<DTOs.McuPin>>(x.Pins)
            }).ToList();
        }

        [HttpGet]
        [Route("device-mode")]
        public ActionResult<dynamic> getDeviceMode()
        {
            return ConvertHelper.EnumToList(typeof(DEVICE_MODE));
        }
    }
}
