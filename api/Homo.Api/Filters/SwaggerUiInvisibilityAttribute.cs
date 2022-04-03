using System;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;


namespace Homo.Api
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class SwaggerUiInvisibilityAttribute : ApiExplorerSettingsAttribute
    {
        public SwaggerUiInvisibilityAttribute()
        {
            if (EnvService.Get().EnvironmentName != "dev")
            {
                IgnoreApi = true;
            }
        }
    }
}