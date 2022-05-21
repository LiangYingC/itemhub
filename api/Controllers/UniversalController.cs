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
            List<ConvertHelper.EnumListWithSymbol> triggerWithSignOperators = new List<ConvertHelper.EnumListWithSymbol>();
            triggerOperators.ForEach(triggerOperator => 
                {
                    if (triggerOperator.Key == TRIGGER_OPERATOR.B.ToString()) 
                    {
                        triggerWithSignOperators.Add(new ConvertHelper.EnumListWithSymbol()
                        {
                            Key = triggerOperator.Key,
                            Label = triggerOperator.Label,
                            Value = triggerOperator.Value,
                            Symbol = ">"
                        });
                        return;
                    } 
                    if (triggerOperator.Key == TRIGGER_OPERATOR.BE.ToString()) 
                    {
                        triggerWithSignOperators.Add(new ConvertHelper.EnumListWithSymbol()
                        {
                            Key = triggerOperator.Key,
                            Label = triggerOperator.Label,
                            Value = triggerOperator.Value,
                            Symbol = ">="
                        });
                        return;
                    }
                    if (triggerOperator.Key == TRIGGER_OPERATOR.L.ToString())
                    {
                        triggerWithSignOperators.Add(new ConvertHelper.EnumListWithSymbol()
                        {
                            Key = triggerOperator.Key,
                            Label = triggerOperator.Label,
                            Value = triggerOperator.Value,
                            Symbol = "<"
                        });
                        return;
                    }
                    if (triggerOperator.Key == TRIGGER_OPERATOR.LE.ToString())
                    {
                        triggerWithSignOperators.Add(new ConvertHelper.EnumListWithSymbol()
                        {
                            Key = triggerOperator.Key,
                            Label = triggerOperator.Label,
                            Value = triggerOperator.Value,
                            Symbol = "<="
                        });
                        return;
                    }
                    if (triggerOperator.Key == TRIGGER_OPERATOR.E.ToString())
                    {
                        triggerWithSignOperators.Add(new ConvertHelper.EnumListWithSymbol()
                        {
                            Key = triggerOperator.Key,
                            Label = triggerOperator.Label,
                            Value = triggerOperator.Value,
                            Symbol = "="
                        });
                        return;
                    }
                    triggerWithSignOperators.Add(new ConvertHelper.EnumListWithSymbol()
                    {
                        Key = triggerOperator.Key,
                        Label = triggerOperator.Label,
                        Value = triggerOperator.Value,
                        Symbol = null
                    });
                }
            );
            return triggerWithSignOperators;
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
