using System.IO;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using System.Threading;

namespace Homo.Api
{
    public interface ILocalizer
    {
        Dictionary<string, Dictionary<string, string>> Mapping { get; set; }
        string Get(string key, CultureInfo cultureInfo, Dictionary<string, string> templateVariables, string resourceFolder);
    }

    public class Localizer : ILocalizer
    {
        public Dictionary<string, Dictionary<string, string>> Mapping { get; set; }
        protected string _sourcePath;
        public Localizer(string sourcePath)
        {
            _sourcePath = sourcePath;
            Mapping = new Dictionary<string, Dictionary<string, string>>();
        }

        public string Get(string key, CultureInfo cultureInfo = null, Dictionary<string, string> templateVariables = null, string resourceFolder = "")
        {
            if (cultureInfo == null)
            {
                cultureInfo = Thread.CurrentThread.CurrentCulture;
            }

            string cultureName = cultureInfo.Name;
            string result = null;
            if (Mapping.ContainsKey(cultureName) && Mapping[cultureName].ContainsKey(key))
            {
                result = Mapping[cultureName][key];
            }

            if (System.IO.File.Exists($"{_sourcePath}/Common/{cultureName}.json"))
            {
                Mapping[cultureName] = JsonConvert.DeserializeObject<Dictionary<string, string>>(File.ReadAllText($"{_sourcePath}/{resourceFolder}/{cultureName}.json"));
            }

            if (Mapping.ContainsKey(cultureName) && Mapping[cultureName].ContainsKey(key))
            {
                result = Mapping[cultureName][key];
            }

            if (result == null)
            {
                result = key;
            }

            if (templateVariables == null)
            {
                return result;
            }

            foreach (string keyInTemplateVariables in templateVariables.Keys)
            {
                result = result.Replace($"{{{keyInTemplateVariables}}}", templateVariables[keyInTemplateVariables]);
            }

            return result;
        }

    }

    public class ErrorMessageLocalizer : Localizer
    {
        public ErrorMessageLocalizer(string sourcePath) : base(sourcePath)
        {
        }

        public string Get(string key, CultureInfo cultureInfo = null, Dictionary<string, string> templateVariables = null)
        {
            return base.Get(key, cultureInfo, templateVariables, "Error");
        }
    }

    public class CommonLocalizer : Localizer
    {
        public CommonLocalizer(string sourcePath) : base(sourcePath)
        {
        }

        public string Get(string key, CultureInfo cultureInfo = null, Dictionary<string, string> templateVariables = null)
        {
            return base.Get(key, cultureInfo, templateVariables, "Common");
        }
    }

    public class ValidationLocalizer : Localizer
    {
        public ValidationLocalizer(string sourcePath) : base(sourcePath)
        {
        }

        public string Get(string key, CultureInfo cultureInfo = null, Dictionary<string, string> templateVariables = null)
        {
            return base.Get(key, cultureInfo, templateVariables, "Validation");
        }
    }
}