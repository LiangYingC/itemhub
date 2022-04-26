using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using Homo.Core.Helpers;
using Ionic.Zip;

namespace Homo.IotApi
{
    public static class FirmwareGenerateService
    {
        public static void Generate(
            string dbc,
            string firmwareTemplatePath,
            string staticPath,
            long deviceId,
            long ownerId,
            string clientId,
            string clientSecret,
            string bundleId,
            string zipPassword
        )
        {
            DbContextOptionsBuilder<IotDbContext> builder = new DbContextOptionsBuilder<IotDbContext>();
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 25));
            builder.UseMySql(dbc, serverVersion);
            IotDbContext dbContext = new IotDbContext(builder.Options);

            Device device = DeviceDataservice.GetOne(dbContext, ownerId, deviceId);

            if (device.Microcontroller == null)
            {
                // no microcontroller
                // return new { message = "microcontroller is null" };
            }

            string mcuName = device.Microcontroller.ToString().ToLower().Replace("_", "-");
            string microcontrollerFirmwareTemplatePath = $"{firmwareTemplatePath}/{mcuName}";
            string folderName = CryptographicHelper.GetSpecificLengthRandomString(32, true, false);
            string firmwareZipPath = $"{staticPath}/firmware/{folderName}.zip";
            string destPath = $"{staticPath}/firmware/{folderName}";
            string inoPath = $"{destPath}/{mcuName}.ino";

            // copy to static 
            CopyDirectory(microcontrollerFirmwareTemplatePath, destPath, true);

            string inoTemplate = System.IO.File.ReadAllText(inoPath);
            inoTemplate = inoTemplate.Replace("{CLIENT_ID}", clientId);
            inoTemplate = inoTemplate.Replace("{CLIENT_SECRET}", clientSecret);
            System.IO.File.WriteAllText(inoPath, inoTemplate);

            // zip
            var zipFile = new ZipFile();
            if (!String.IsNullOrEmpty(zipPassword))
            {
                zipFile.Password = zipPassword;
            }
            zipFile.AddDirectory(destPath);
            zipFile.Save(firmwareZipPath);

            // archived source firmware
            System.IO.Directory.Move(destPath, $"{staticPath}/archived/{folderName}");

            // countdown 10 mins then remove zip file
            var tokenSource = new CancellationTokenSource();
            CancellationToken cancellationToken = tokenSource.Token;
            var task = Task.Run(async () =>
            {
                await Task.Delay(10 * 60 * 1000);
                if (cancellationToken.IsCancellationRequested)
                {
                    return;
                }

                System.IO.File.Delete(firmwareZipPath);
            }, tokenSource.Token);

            // update firmware bundle log
            FirmwareBundleLogDataservice.UpdateFirmwareFile(dbContext, folderName, bundleId);
        }
        private static void CopyDirectory(string sourceDir, string destinationDir, bool recursive)
        {
            // Get information about the source directory
            var dir = new DirectoryInfo(sourceDir);

            // Check if the source directory exists
            if (!dir.Exists)
                throw new DirectoryNotFoundException($"Source directory not found: {dir.FullName}");

            // Cache directories before we start copying
            DirectoryInfo[] dirs = dir.GetDirectories();

            // Create the destination directory
            Directory.CreateDirectory(destinationDir);

            // Get the files in the source directory and copy to the destination directory
            foreach (FileInfo file in dir.GetFiles())
            {
                string targetFilePath = Path.Combine(destinationDir, file.Name);
                file.CopyTo(targetFilePath);
            }

            // If recursive and copying subdirectories, recursively call this method
            if (recursive)
            {
                foreach (DirectoryInfo subDir in dirs)
                {
                    string newDestinationDir = Path.Combine(destinationDir, subDir.Name);
                    CopyDirectory(subDir.FullName, newDestinationDir, true);
                }
            }
        }
    }
}
