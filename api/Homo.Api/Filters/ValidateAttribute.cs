using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Homo.Core.Constants;

namespace Homo.Api
{
    public class ValidateAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!filterContext.ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = filterContext.ModelState.Values.SelectMany(v => v.Errors);
                ModelStateDictionary.KeyEnumerable keys = filterContext.ModelState.Keys;
                Dictionary<string, dynamic> results = new Dictionary<string, dynamic>();
                for (int i = 0; i < keys.Count(); i++)
                {
                    string key = keys.ElementAt(i).ToString();
                    IEnumerable<ModelError> errors = filterContext.ModelState.GetValueOrDefault(key).Errors;
                    List<string> errorMessages = errors.Select(x => x.ErrorMessage).ToList<string>();
                    results.Add($"{key.Substring(0, 1).ToLower()}{key.Substring(1)}", errorMessages);
                }
                throw new CustomException(ERROR_CODE.INVALID_FORM, System.Net.HttpStatusCode.BadRequest, null, results);
            }
        }
    }
}