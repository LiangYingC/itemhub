using System;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Homo.Api
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private string envName;
        protected IServiceProvider _serviceProvider;
        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                envName = env.EnvironmentName;
                _serviceProvider = serviceProvider;
                IOptions<AppSettings> config = _serviceProvider.GetService<IOptions<AppSettings>>();
                ErrorMessageLocalizer localizer = _serviceProvider.GetService<ErrorMessageLocalizer>();
                HandleExceptionAsync(context, ex, config, localizer);
            }
        }

        protected virtual ActionResult<dynamic> HandleExceptionAsync(HttpContext context, Exception ex, IOptions<IAppSettings> config, ErrorMessageLocalizer localizer)
        {
            var appSettings = JsonConvert.DeserializeObject<AppSettings>(JsonConvert.SerializeObject(config.Value));
            string localizationResourcesPath = appSettings.Common.LocalizationResourcesPath;
            var code = HttpStatusCode.InternalServerError;
            string errorKey = "";
            string internalErrorMessage = "";
            if (envName != "dev" && envName != "Development")
            {
                internalErrorMessage = System.Web.HttpUtility.JavaScriptStringEncode(ex.Message);
            }
            else
            {
                internalErrorMessage = System.Web.HttpUtility.JavaScriptStringEncode(ex.ToString());
            }

            Dictionary<string, dynamic> payload = null;
            if (ex.GetType() == typeof(Homo.Core.Constants.CustomException))
            {
                var customEx = (Homo.Core.Constants.CustomException)ex;
                if (customEx.code != HttpStatusCode.OK)
                {
                    code = customEx.code;
                }

                errorKey = customEx.errorCode.ToString();
                internalErrorMessage = localizer.Get(customEx.errorCode);

                if (customEx.option != null)
                {
                    foreach (string key in customEx.option.Keys)
                    {
                        string value = "";
                        customEx.option.TryGetValue(key, out value);
                        internalErrorMessage = internalErrorMessage.Replace("{" + key + "}", value);
                    }
                }
                payload = customEx.payload;
            }
            var result = new { message = internalErrorMessage, errorKey = errorKey, stackTrace = ex.StackTrace, payload = payload };
            try
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)code.GetHashCode();
            }
            catch (System.Exception exInner)
            {
                throw new Exception(ex.ToString() + exInner.ToString());
            }
            return context.Response.WriteAsync(JsonConvert.SerializeObject(result));
        }
    }
}
