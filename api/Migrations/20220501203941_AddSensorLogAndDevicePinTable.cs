using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class AddSensorLogAndDevicePinTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DevicePin",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Pin = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Mode = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    DeviceId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevicePin", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DevicePin_Device_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Device",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SensorLog",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Pin = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    DeviceId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SensorLog_Device_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Device",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Trigger_CreatedAt",
                table: "Trigger",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Trigger_DeletedAt",
                table: "Trigger",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_DeletedAt",
                table: "Transaction",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ThirdPartyPaymentFlow_DeletedAt",
                table: "ThirdPartyPaymentFlow",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_CreatedAt",
                table: "Subscription",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_DeletedAt",
                table: "Subscription",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_CreatedAt",
                table: "OauthClient",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OauthClient_DeletedAt",
                table: "OauthClient",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceActivityLog_DeletedAt",
                table: "DeviceActivityLog",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Device_CreatedAt",
                table: "Device",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Device_DeletedAt",
                table: "Device",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_CreatedAt",
                table: "DevicePin",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_DeletedAt",
                table: "DevicePin",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_DeviceId",
                table: "DevicePin",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_Mode",
                table: "DevicePin",
                column: "Mode");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_Name",
                table: "DevicePin",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_OwnerId",
                table: "DevicePin",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePin_Value",
                table: "DevicePin",
                column: "Value");

            migrationBuilder.CreateIndex(
                name: "IX_SensorLog_CreatedAt",
                table: "SensorLog",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SensorLog_DeletedAt",
                table: "SensorLog",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SensorLog_DeviceId",
                table: "SensorLog",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_SensorLog_OwnerId",
                table: "SensorLog",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_SensorLog_Pin",
                table: "SensorLog",
                column: "Pin");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevicePin");

            migrationBuilder.DropTable(
                name: "SensorLog");

            migrationBuilder.DropIndex(
                name: "IX_Trigger_CreatedAt",
                table: "Trigger");

            migrationBuilder.DropIndex(
                name: "IX_Trigger_DeletedAt",
                table: "Trigger");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_DeletedAt",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_ThirdPartyPaymentFlow_DeletedAt",
                table: "ThirdPartyPaymentFlow");

            migrationBuilder.DropIndex(
                name: "IX_Subscription_CreatedAt",
                table: "Subscription");

            migrationBuilder.DropIndex(
                name: "IX_Subscription_DeletedAt",
                table: "Subscription");

            migrationBuilder.DropIndex(
                name: "IX_OauthClient_CreatedAt",
                table: "OauthClient");

            migrationBuilder.DropIndex(
                name: "IX_OauthClient_DeletedAt",
                table: "OauthClient");

            migrationBuilder.DropIndex(
                name: "IX_DeviceActivityLog_DeletedAt",
                table: "DeviceActivityLog");

            migrationBuilder.DropIndex(
                name: "IX_Device_CreatedAt",
                table: "Device");

            migrationBuilder.DropIndex(
                name: "IX_Device_DeletedAt",
                table: "Device");
        }
    }
}
