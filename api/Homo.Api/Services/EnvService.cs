using Microsoft.AspNetCore.Hosting;

namespace Homo.Api
{
    public static class EnvService
    {
        public static IWebHostEnvironment _env;
        public static void Set(IWebHostEnvironment env)
        {
            _env = env;
        }
        public static IWebHostEnvironment Get()
        {
            return _env;
        }
    }
}
