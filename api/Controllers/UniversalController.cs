using System;
using System.Collections.Generic;
using System.Reflection;
using System.Linq;
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

namespace Homo.IotApi
{
    [Route("v1/universal")]
    public class UniversalController : ControllerBase
    {
        private readonly string _envName;
        public UniversalController()
        {
        }

        [HttpGet]
        public ActionResult<dynamic> getAll()
        {
            return new
            {
                authProvider = _getListOfTypes(typeof(Homo.AuthApi.SocialMediaProvider))
            };
        }

        public List<dynamic> _getListOfTypes(Type aType)
        {
            List<string> names = Enum.GetNames(aType).ToList<string>();
            Array values = Enum.GetValues(aType);
            List<dynamic> list = new List<dynamic>();
            for (int i = 0; i < names.Count(); i++)
            {
                var source = values.GetValue(i);
                FieldInfo fi = source.GetType().GetField(source.ToString());
                DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);
                string label = source.ToString();
                if (attributes.Length > 0)
                {
                    label = attributes[0].Description;
                }
                list.Add(new
                {
                    key = names[i],
                    label = label,
                    value = values.GetValue(i)
                });
            }
            return list;
        }
    }
}