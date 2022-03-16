using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class ChangeOauthClientUniqueIndex3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_ClientId_DeletedAt",
                table: "OauthClient",
                columns: new[] { "ClientId", "DeletedAt" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OauthClient_ClientId_DeletedAt",
                table: "OauthClient");
        }
    }
}
