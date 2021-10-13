using System.Linq;

namespace Homo.IotApi
{
    public class OauthCodeDataservice
    {
        public static OauthCode GetOne(IotDbContext dbContext, long id)
        {
            return dbContext.OauthCode.FirstOrDefault(x => x.DeletedAt == null && x.Id == id);
        }

        public static OauthCode GetOneByCode(IotDbContext dbContext, string code)
        {
            return dbContext.OauthCode.FirstOrDefault(x => x.DeletedAt == null && x.Code == code);
        }

        public static OauthCode Create(IotDbContext dbContext, DTOs.OauthCode dto)
        {
            OauthCode record = new OauthCode();
            foreach (var propOfDTO in dto.GetType().GetProperties())
            {
                var value = propOfDTO.GetValue(dto);
                var prop = record.GetType().GetProperty(propOfDTO.Name);
                prop.SetValue(record, value);
            }
            record.CreatedAt = System.DateTime.Now;
            dbContext.OauthCode.Add(record);
            dbContext.SaveChanges();
            return record;
        }
    }
}
