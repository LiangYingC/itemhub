using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class changestopnextsubscriptiondefaultvalue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "StopNextSubscribed",
                table: "Subscription",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "0",
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValueSql: "1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "StopNextSubscribed",
                table: "Subscription",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "1",
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValueSql: "0");
        }
    }
}
