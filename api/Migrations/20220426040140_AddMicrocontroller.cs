using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class AddMicrocontroller : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Filename",
                table: "FirmwareBundleLog",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Microcontroller",
                table: "FirmwareBundleLog",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Microcontroller",
                table: "Device",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Device_Microcontroller",
                table: "Device",
                column: "Microcontroller");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Device_Microcontroller",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "Filename",
                table: "FirmwareBundleLog");

            migrationBuilder.DropColumn(
                name: "Microcontroller",
                table: "FirmwareBundleLog");

            migrationBuilder.DropColumn(
                name: "Microcontroller",
                table: "Device");
        }
    }
}
