using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class updatedevicepin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "EditedBy",
                table: "DevicePin",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EditedBy",
                table: "DevicePin");
        }
    }
}
