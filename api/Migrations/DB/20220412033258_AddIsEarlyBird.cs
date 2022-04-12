using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations.DB
{
    public partial class AddIsEarlyBird : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEarlyBird",
                table: "User",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "0");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEarlyBird",
                table: "User");
        }
    }
}
