using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations.DB
{
    public partial class AddIsOverSubscriptionPlan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOverSubscriptionPlan",
                table: "User",
                type: "tinyint(1)",
                nullable: true,
                defaultValueSql: "0");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOverSubscriptionPlan",
                table: "User");
        }
    }
}
