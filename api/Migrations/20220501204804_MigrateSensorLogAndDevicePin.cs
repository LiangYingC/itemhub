using Microsoft.EntityFrameworkCore.Migrations;

namespace IotApi.Migrations
{
    public partial class MigrateSensorLogAndDevicePin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrate DevicePinSensor to SensorLog
            migrationBuilder.Sql("INSERT INTO SensorLog (CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, Value, DeviceId) SELECT CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, Value, DeviceId FROM DevicePinSensor");

            // migrate DevicePinSensor And DeivcePinSwitch to DevicePin
            migrationBuilder.Sql(@"INSERT DevicePin (CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, Mode, Value, DeviceId)
                                   SELECT NOW(), EditedAt, OwnerId, DeletedAt, Pin, 1, Value, DeviceId FROM DevicePinSwitch
                                   UNION (
                                       SELECT NOW() as CreatedAt, NULL, OwnerId, NULL, Pin, 0, NULL, DeviceId FROM DevicePinSensor WHERE CreatedAt > (NOW() - interval 3 day) GROUP BY OwnerId, DeviceId, Pin 
                                    )"
                                );
            migrationBuilder.Sql("TRUNCATE TABLE DevicePinSensor; TRUNCATE TABLE DevicePinSwitch;");

            // update device name
            migrationBuilder.Sql(@"UPDATE DevicePin  
                                   INNER JOIN DevicePinName ON DevicePin.Pin = DevicePinName.Pin
                                   AND DevicePin.DeviceId = DevicePinName.DeviceId
                                   AND DevicePinName.DeletedAt IS NULL
                                   SET DevicePin.Name = DevicePinName.Name"
                                );
            migrationBuilder.Sql("TRUNCATE TABLE DevicePinName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO DevicePinSensor (CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, Value, DeviceId, Mode) SELECT Now() + interval 30 day, EditedAt, OwnerId, DeletedAt, Pin, Value, DeviceId, 0 FROM SensorLog");
            migrationBuilder.Sql("TRUNCATE TABLE SensorLog");

            migrationBuilder.Sql(@"INSERT INTO DevicePinSwitch (CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, Mode, Value, DeviceId) 
                                   SELECT CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, 1, Value, DeviceId FROM DevicePin WHERE Mode = 1");

            migrationBuilder.Sql(@"INSERT INTO DevicePinName (CreatedAt, EditedAt, OwnerId, DeletedAt, Pin, DeviceId, Name)
                                   SELECT Now(), EditedAt, OwnerId, DeletedAt, Pin, DeviceId, Name FROM DevicePin");
            migrationBuilder.Sql("TRUNCATE TABLE DevicePin");
        }
    }
}
