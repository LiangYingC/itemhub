using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using Homo.Api;
using Homo.Core.Constants;
using Homo.Core.Helpers;


namespace Homo.IotApi
{
    [Route("v1/my/devices")]
    [IotDashboardAuthorizeFactory]
    [SwaggerUiInvisibility]
    [Validate]
    public class MyDeviceFirmwareController : ControllerBase
    {
        private readonly IotDbContext _dbContext;
        readonly string _firmwareTemplatePath;
        readonly string _staticPath;
        readonly string _dbc;
        public MyDeviceFirmwareController(IotDbContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
            _firmwareTemplatePath = appSettings.Value.Common.FirmwareTemplatePath;
            _staticPath = appSettings.Value.Common.StaticPath;
            _dbc = appSettings.Value.Secrets.DBConnectionString;
        }

        [HttpPost]
        [Route("{id}/bundle-firmware")]
        public ActionResult<dynamic> generate([FromRoute] long id, DTOs.Firmware dto, Homo.AuthApi.DTOs.JwtExtraPayload extraPayload)
        {
            // validation 
            Device device = DeviceDataservice.GetOne(_dbContext, extraPayload.Id, id);
            if (device == null)
            {
                throw new CustomException(ERROR_CODE.DEVICE_NOT_FOUND, System.Net.HttpStatusCode.NotFound);
            }

            if (device.Microcontroller == null)
            {
                throw new CustomException(ERROR_CODE.DEIVCE_WITHOUT_MCU, System.Net.HttpStatusCode.Forbidden);
            }

            // delete exists oAuthClient
            OauthClientDataservice.DeleteByDeviceId(_dbContext, extraPayload.Id, id);

            // create oAuthClient
            string clientSecret = CryptographicHelper.GetSpecificLengthRandomString(64, true, false);
            string salt = CryptographicHelper.GetSpecificLengthRandomString(128, false, false);
            string hashClientSecrets = CryptographicHelper.GenerateSaltedHash(clientSecret, salt);
            string randomClientId = CryptographicHelper.GetSpecificLengthRandomString(64, true, false);

            OauthClient client = OauthClientDataservice.Create(_dbContext, extraPayload.Id, new DTOs.OauthClient()
            {
                ClientId = randomClientId,
                DeviceId = id
            }, hashClientSecrets, salt);

            // create bundle log
            string randomBundleId = CryptographicHelper.GetSpecificLengthRandomString(32, true, false);
            FirmwareBundleLogDataservice.Create(_dbContext, extraPayload.Id, id, randomBundleId);

            // pass client id, client secrets and bundle id to asyn bundle firmware function
            var task = System.Threading.Tasks.Task.Run(async () =>
            {
                await System.Threading.Tasks.Task.Delay(20 * 1000);
                FirmwareGenerateService.Generate(_dbc, _firmwareTemplatePath, _staticPath, id, extraPayload.Id, randomClientId, clientSecret, randomBundleId, dto.ZipPassword);
            });

            return new { bundleId = randomBundleId };
        }

    }
}
