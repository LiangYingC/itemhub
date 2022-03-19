using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class ChangeOauthClientUniqueIndex2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OauthClient_OwnerId_ClientId",
                table: "OauthClient");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_OwnerId_ClientId_DeletedAt",
                table: "OauthClient",
                columns: new[] { "OwnerId", "ClientId", "DeletedAt" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OauthClient_OwnerId_ClientId_DeletedAt",
                table: "OauthClient");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_OwnerId_ClientId",
                table: "OauthClient",
                columns: new[] { "OwnerId", "ClientId" },
                unique: true);
        }
    }
}
