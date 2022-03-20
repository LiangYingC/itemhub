using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class ChangeOauthClientUniqueIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OauthClient_ClientId",
                table: "OauthClient");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_ClientId",
                table: "OauthClient",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_OwnerId_ClientId",
                table: "OauthClient",
                columns: new[] { "OwnerId", "ClientId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OauthClient_ClientId",
                table: "OauthClient");

            migrationBuilder.DropIndex(
                name: "IX_OauthClient_OwnerId_ClientId",
                table: "OauthClient");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_ClientId",
                table: "OauthClient",
                column: "ClientId",
                unique: true);
        }
    }
}
