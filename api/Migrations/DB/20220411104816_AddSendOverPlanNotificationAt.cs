using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations.DB
{
    public partial class AddSendOverPlanNotificationAt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SendOverPlanNotificationAt",
                table: "User",
                type: "datetime(6)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SendOverPlanNotificationAt",
                table: "User");
        }
    }
}
