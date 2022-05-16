using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class RemoveDevicePinXXX : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevicePinName");

            migrationBuilder.DropTable(
                name: "DevicePinSensor");

            migrationBuilder.DropTable(
                name: "DevicePinSwitch");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DevicePinName",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeviceId = table.Column<long>(type: "bigint", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    Pin = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevicePinName", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DevicePinSensor",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeviceId = table.Column<long>(type: "bigint", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Mode = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    Pin = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<decimal>(type: "decimal(65,30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevicePinSensor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DevicePinSensor_Device_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Device",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DevicePinSwitch",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeviceId = table.Column<long>(type: "bigint", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Mode = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    Pin = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<decimal>(type: "decimal(65,30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevicePinSwitch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DevicePinSwitch_Device_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Device",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinName_DeviceId",
                table: "DevicePinName",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinName_OwnerId",
                table: "DevicePinName",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinName_Pin",
                table: "DevicePinName",
                column: "Pin");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSensor_DeviceId",
                table: "DevicePinSensor",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSensor_Mode",
                table: "DevicePinSensor",
                column: "Mode");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSensor_OwnerId",
                table: "DevicePinSensor",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSensor_Pin",
                table: "DevicePinSensor",
                column: "Pin");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSwitch_DeviceId",
                table: "DevicePinSwitch",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSwitch_Mode",
                table: "DevicePinSwitch",
                column: "Mode");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSwitch_OwnerId",
                table: "DevicePinSwitch",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_DevicePinSwitch_Pin",
                table: "DevicePinSwitch",
                column: "Pin");
        }
    }
}
