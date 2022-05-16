using System;
using System.Collections.Generic;
using System.Linq;

namespace Homo.IotApi
{
    public class MicrocontrollerDataservice
    {
        public static Microcontroller GetOne(IotDbContext dbContext, long id)
        {
            return dbContext.Microcontroller.Where(x =>
                x.Id == id
                && x.DeletedAt == null
            ).FirstOrDefault();
        }

    }
}
