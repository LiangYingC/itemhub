using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class AddUniqueIndexForFirmwareBundleId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_FirmwareBundleLog_BundleId_DeletedAt",
                table: "FirmwareBundleLog",
                columns: new[] { "BundleId", "DeletedAt" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FirmwareBundleLog_BundleId_DeletedAt",
                table: "FirmwareBundleLog");
        }
    }
}
