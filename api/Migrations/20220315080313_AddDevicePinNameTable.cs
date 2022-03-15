using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class AddDevicePinNameTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_DevicePinName_DeviceId",
                table: "DevicePinName",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinName_OwnerId",
                table: "DevicePinName",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinName_Pin",
                table: "DevicePinName",
                column: "Pin");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DevicePinName_DeviceId",
                table: "DevicePinName");

            migrationBuilder.DropIndex(
                name: "IX_DevicePinName_OwnerId",
                table: "DevicePinName");

            migrationBuilder.DropIndex(
                name: "IX_DevicePinName_Pin",
                table: "DevicePinName");
        }
    }
}
