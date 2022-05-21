using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class GenerateEarlyAdapterFirstSubscription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE `User` Set IsEarlyBird = 1 WHERE CreatedAt <= 2022-06-11");
            migrationBuilder.Sql(@"INSERT INTO `Subscription` (CreatedAt, OwnerId, StartAt, EndAt, PricingPlan, TransactionId) 
            SELECT NOW(), Id, NOW(), DATE_ADD(DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 23 HOUR), INTERVAL 59 MINUTE), INTERVAL 59 SECOND), 1, 0 FROM `User`");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE `User` Set IsEarlyBird = 0");
            migrationBuilder.Sql(@"DELETE FROM `Subscription` WHERE TransactionId = 0 AND CreatedAt <= '2022-06-11'");
        }
    }
}
