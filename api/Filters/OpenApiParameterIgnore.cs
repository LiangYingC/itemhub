using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class OpenApiParameterIgnoreAttribute : System.Attribute
    {
    }

    public class OpenApiParameterIgnoreFilter : Swashbuckle.AspNetCore.SwaggerGen.IOperationFilter
    {
        public void Apply(Microsoft.OpenApi.Models.OpenApiOperation operation, Swashbuckle.AspNetCore.SwaggerGen.OperationFilterContext context)
        {
            if (operation == null || context == null || context.ApiDescription?.ParameterDescriptions == null)
                return;

            var parametersToHide = context.ApiDescription.ParameterDescriptions
                .Where(parameterDescription => ParameterHasIgnoreAttribute(parameterDescription))
                .ToList();

            if (parametersToHide.Count == 0)
                return;

            foreach (var parameterToHide in parametersToHide)
            {
                var parameter = operation.Parameters.FirstOrDefault(parameter => string.Equals(parameter.Name, parameterToHide.Name, System.StringComparison.Ordinal));
                if (parameter != null)
                    operation.Parameters.Remove(parameter);
            }
        }

        private static bool ParameterHasIgnoreAttribute(Microsoft.AspNetCore.Mvc.ApiExplorer.ApiParameterDescription parameterDescription)
        {
            if (parameterDescription.ModelMetadata is Microsoft.AspNetCore.Mvc.ModelBinding.Metadata.DefaultModelMetadata metadata)
            {
                // 透過 attribute 加到 parameters 這邊會被打散
                // todo: refactor AuthorzieAttribute
                if (metadata.Attributes == null || metadata.Attributes.ParameterAttributes == null)
                {
                    return true;
                }

                return metadata.Attributes.ParameterAttributes.Any(attribute =>
                {
                    return attribute.GetType() == typeof(OpenApiParameterIgnoreAttribute);
                });
            }

            return false;
        }

    }
}