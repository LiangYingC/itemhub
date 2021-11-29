using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Homo.Api;
using Homo.AuthApi;
using Homo.Core.Constants;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Homo.IotApi
{
    [IotAuthorizeFactory]
    [Route("v1/contact")]
    [Validate]
    public class ContactController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        private readonly string _toMail;
        private readonly string _sendGridApiKey;
        public ContactController(IotDbContext dbContext, IOptions<AppSettings> optionAppSettings)
        {
            _dbContext = dbContext;
            AppSettings settings = optionAppSettings.Value;
            _toMail = optionAppSettings.Value.Common.SystemEmail;
            _sendGridApiKey = optionAppSettings.Value.Secrets.SendGridApiKey;
        }

        [HttpPost]
        public async Task<dynamic> sendEmailToUs([FromBody] DTOs.ContactUs dto)
        {
            await MailHelper.Send(MailProvider.SEND_GRID, new MailTemplate()
            {
                Subject = $"ItemHub 官網聯繫 {dto.Subject}",
                Content = dto.Content
            }, dto.FromMail, _toMail, _sendGridApiKey);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
