using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class GenerateEarlyAdapterFirstSubscription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE `User` Set IsEarlyBird = 1");
            migrationBuilder.Sql(@"INSERT INTO `Subscription` (CreatedAt, OwnerId, StartAt, EndAt, PricingPlan, TransactionId) 
            SELECT NOW(), Id, NOW(), LAST_DAY(NOW()), 1, 0 FROM `User`");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE `User` Set IsEarlyBird = 0");
            migrationBuilder.Sql(@"DELETE FROM `Subscription` WHERE TransactionId = 0 AND CreatedAt <= '2022-06-11'");
        }
    }
}
