using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations.DB
{
    public partial class AddSendOverPlanNotificationCount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SendOverPlanNotificationCount",
                table: "User",
                type: "int",
                nullable: false,
                defaultValueSql: "0");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SendOverPlanNotificationCount",
                table: "User");
        }
    }
}
