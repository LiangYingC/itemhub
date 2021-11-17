using System;

namespace Homo.AuthApi
{
    public abstract partial class DTOs
    {
        public partial class Group : DTOs
        {
            public string Name { get; set; }
            public string Roles { get; set; }
        }
    }
}
