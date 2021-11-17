namespace Homo.Api
{
    public interface IAppSettings
    {
        // ICommon Common { get; set; }
        // ISecrets Secrets { get; set; }
    }

    public class AppSettings : IAppSettings
    {
        public Common Common { get; set; }
        public Secrets Secrets { get; set; }
    }

    public class Common
    {
        public string LocalizationResourcesPath { get; set; }
    }

    public class Secrets
    {
    }

    public interface ICommon
    {
        string LocalizationResourcesPath { get; set; }
    }

    public interface ISecrets
    {

    }
}
