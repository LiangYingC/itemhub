using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class AddDeviceIdForOauthClient : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "DeviceId",
                table: "OauthClient",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_DeviceId",
                table: "OauthClient",
                column: "DeviceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OauthClient_DeviceId",
                table: "OauthClient");

            migrationBuilder.DropColumn(
                name: "DeviceId",
                table: "OauthClient");
        }
    }
}
