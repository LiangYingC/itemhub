using System;
using Microsoft.AspNetCore.Mvc;
using Homo.Core.Constants;
using Homo.Api;
using Homo.Core.Helpers;
using Microsoft.Extensions.Options;

namespace Homo.AuthApi
{
    [Route("v1/me")]
    [AuthorizeFactory]
    public class MeUpdateInfoController : ControllerBase
    {

        private readonly DBContext _dbContext;
        private readonly string _PKCS1PublicKeyPath;
        public MeUpdateInfoController(DBContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
            Common common = (Common)appSettings.Value.Common;
            _PKCS1PublicKeyPath = common.Pkcs1PublicKeyPath;
        }

        [HttpPatch]
        [Validate]
        public dynamic updateInfo([FromBody] DTOs.UpdateMe dto, DTOs.JwtExtraPayload extraPayload)
        {
            DTOs.UpdateMePseudonymous pseudonymousDto = new DTOs.UpdateMePseudonymous();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = pseudonymousDto.GetType().GetProperty(propOfDTO.Name);
                if (prop != null)
                {
                    prop.SetValue(pseudonymousDto, value);
                }
            }

            if (!String.IsNullOrEmpty(dto.Phone))
            {
                pseudonymousDto.EncryptPhone = CryptographicHelper.GetRSAEncryptResult(_PKCS1PublicKeyPath, dto.Phone);
                pseudonymousDto.PseudonymousPhone = CryptographicHelper.GetHiddenString(dto.Phone, 2, 2);
            }

            if (!String.IsNullOrEmpty(dto.Address))
            {
                pseudonymousDto.EncryptAddress = CryptographicHelper.GetRSAEncryptResult(_PKCS1PublicKeyPath, dto.Address);
                pseudonymousDto.PseudonymousAddress = CryptographicHelper.GetHiddenString(dto.Address, 2, 2);
            }

            UserDataservice.Update(_dbContext, extraPayload.Id, pseudonymousDto, extraPayload.Id);
            return new { status = CUSTOM_RESPONSE.OK };
        }
    }
}
