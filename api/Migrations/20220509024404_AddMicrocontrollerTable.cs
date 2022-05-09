using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class AddMicrocontrollerTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Microcontroller",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Key = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pins = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: false),
                    EditedBy = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Microcontroller", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Microcontroller_CreatedAt",
                table: "Microcontroller",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Microcontroller_CreatedBy",
                table: "Microcontroller",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Microcontroller_DeletedAt",
                table: "Microcontroller",
                column: "DeletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Microcontroller_DeletedAt_Key",
                table: "Microcontroller",
                columns: new[] { "DeletedAt", "Key" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Microcontroller");
        }
    }
}
