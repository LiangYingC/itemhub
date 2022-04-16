#include <string>
#include <vector>
#include "DHT/DHT.h"
#include "ItemhubUtilities/ItemhubUtilities.h"
#include "ca-pem.h"

#define DHTPIN D1
#define DHTTYPE DHT11

#define SWITCH "SWITCH"
#define SENSOR "SENSOR"

#define ERROR_THEN_RECONNECT(resp)                      \
    if (resp.length() == 0)                             \
    {                                                   \
        client.stop();                                  \
        client.close();                                 \
        client.init(caPem.c_str(), caPem.length() + 1); \
        char *api = (char *)apiEndpoint.c_str();        \
        client.connect(api, 443);                       \
        return;                                         \
    }

DHT dht(DHTPIN, DHTTYPE);
TlsTcpClient client;
std::string caPem = CA_PEM;
unsigned long lastSync = millis();

std::string apiEndpoint = "itemhub.io";

std::string emptyString = "";
std::string authApiEndpoint = "/api/v1/oauth/exchange-token-for-device";
std::string authPostBody = "{\"clientId\":\"miterfrants@gmail.com\",\"clientSecret\":\"@Testing123123\"}";
std::string remoteDeviceId = "";
std::string token = "";
std::string POST = "POST";
std::string GET = "GET";
std::vector<ItemhubPin> pins;
long noDataCount = 0;

const int intervalSensor = 30 * 1000;
const int intervalSwitch = 2000;
const int intervalDeviceState = 2000;

unsigned long currentSensorTimestamp;
unsigned long previousSensorTimestamp;
unsigned long currentSwitchTimestamp;
unsigned long previousSwitchTimestamp;
unsigned long currentDeviceStateTimestamp;
unsigned long previousDeviceStateTimestamp;

bool respFlag = false;
unsigned char buff[512];

void setup()
{
    delay(5000);

    Serial.begin(9600);
    dht.begin();
    pins.push_back(ItemhubPin(D0, "D0", SWITCH));

    // setup Root CA pem.
    client.init(caPem.c_str(), caPem.length() + 1);
    char *api = (char *)apiEndpoint.c_str();
    client.connect(api, 443);
    if (!client.verify())
    {
        Serial.println("Server Certificates is in-valid.");
    }

    // itemhub authorize
    auth();
    Serial.println("authorized");

    // itemhub check device exists in remote server
    setupRemoteDeviceId();
    Serial.print("remote device id: ");
    Serial.println(remoteDeviceId.c_str());
}

void loop()
{ // itemhub device state
    currentDeviceStateTimestamp = millis();
    if (currentDeviceStateTimestamp - previousDeviceStateTimestamp > intervalDeviceState)
    {
        previousDeviceStateTimestamp = currentDeviceStateTimestamp;
        online();
    }

    // itemhub switch
    currentSwitchTimestamp = millis();
    if (currentSwitchTimestamp - previousSwitchTimestamp > intervalSwitch)
    {
        previousSwitchTimestamp = currentSwitchTimestamp;
        checkSwitchState();
    }

    // itemhub sensor
    currentSensorTimestamp = millis();
    if (currentSensorTimestamp - previousSensorTimestamp > intervalSensor)
    {
        previousSensorTimestamp = currentSensorTimestamp;
        sendSensor();
    }
}

void auth()
{
    std::string resp = ItemhubUtilities::Send(client, apiEndpoint, caPem, POST, authApiEndpoint, authPostBody, emptyString);
    token = ItemhubUtilities::Extract(resp, "token");
}

void setupRemoteDeviceId()
{
    String deviceId = System.deviceID();
    std::string byDeviceIdEndPoint = "/api/v1/me/devices/by-device-id/";
    byDeviceIdEndPoint.append(deviceId);
    std::string respOfGetDevice = ItemhubUtilities::Send(client, apiEndpoint, caPem, GET, byDeviceIdEndPoint, emptyString, token);
    int status = ItemhubUtilities::GetHttpStatus(respOfGetDevice);
    // if device not exists register new one
    if (status == 404)
    {
        Serial.println("register new device");
        std::string postBodyOfRegisterDevice("{\"deviceId\": \"\", \"name\": \"\"}");
        postBodyOfRegisterDevice.replace(14, 0, deviceId);
        postBodyOfRegisterDevice.replace(26 + deviceId.length(), 0, deviceId);
        Serial.println(postBodyOfRegisterDevice.c_str());
        std::string deviceApiEndpoint = "/api/v1/me/devices";
        respOfGetDevice = ItemhubUtilities::Send(client, apiEndpoint, caPem, POST, deviceApiEndpoint, postBodyOfRegisterDevice, token);
    }
    // assign remoteDeviceId
    remoteDeviceId = ItemhubUtilities::Extract(respOfGetDevice, "id");
}

void online()
{
    std::string deviceOnlineEndpoint = "/api/v1/me/devices/";
    deviceOnlineEndpoint.append(remoteDeviceId);
    deviceOnlineEndpoint.append("/online");
    Serial.println("Update State Http Status Start");
    std::string resp = ItemhubUtilities::Send(client, apiEndpoint, caPem, POST, deviceOnlineEndpoint, emptyString, token);
    Serial.print("resp length:");
    Serial.println(resp.length());
    ERROR_THEN_RECONNECT(resp);
    Serial.println(resp.c_str());
    std::string status = ItemhubUtilities::Extract(resp, "status");
    Serial.println(status.c_str());
    Serial.println("Update State Http Status End");
    Serial.println("========================================");
}

void checkSwitchState()
{
    Serial.println("Check switch state");
    std::string deviceStateEndpoint = "/api/v1/me/devices/";
    deviceStateEndpoint.append(remoteDeviceId);
    deviceStateEndpoint.append("/switches");

    std::string resp = ItemhubUtilities::Send(client, apiEndpoint, caPem, GET, deviceStateEndpoint, emptyString, token);
    ERROR_THEN_RECONNECT(resp);
    resp.insert(0, "{\"data\":");
    resp.append("}");
    json_t const *jsonData = json_create((char *)resp.c_str(), pool, MAX_FIELDS);
    if (jsonData == NULL)
    {
        return;
    }
    json_t const *data = json_getProperty(jsonData, "data");
    json_t const *item;
    for (int i = 0; i < pins.size(); i++)
    {
        if (pins[i].mode == SENSOR)
        {
            continue;
        }

        bool isExists = false;

        for (item = json_getChild(data); item != 0; item = json_getSibling(item))
        {
            if (JSON_OBJ != json_getType(item))
            {
                continue;
            }

            char const *pin = json_getPropertyValue(item, "pin");
            char const *value = json_getPropertyValue(item, "value");
            if (!pin)
            {
                continue;
            }

            String stringValue = String(value);
            int intValue = stringValue.toInt();

            if (pins[i].pinString == pin && intValue == 0)
            {
                isExists = true;
                digitalWrite(pins[i].pin, LOW);
            }
            else if (pins[i].pinString == pin && intValue == 1)
            {
                isExists = true;
                digitalWrite(pins[i].pin, HIGH);
            }
        }
        if (isExists == false)
        {
            std::string endpoint = "/api/v1/me/devices/";
            endpoint.append(remoteDeviceId);
            endpoint.append("/switches");

            std::string postBody = "{\"pin\":\"";
            postBody.append(pins[i].pinString);
            postBody.append("\",\"");
            postBody.append("mode\":");
            postBody.append("1,");
            postBody.append("\"value\":");
            postBody.append("0,");
            postBody.append("\"online\":");
            postBody.append("true");
            postBody.append("}");

            std::string respOfRegisterPin = ItemhubUtilities::Send(client, apiEndpoint, caPem, POST, endpoint, postBody, token);
            ERROR_THEN_RECONNECT(resp);
            Serial.print("register new pin: ");
            Serial.println(respOfRegisterPin.c_str());
        }
    }
}

void sendSensor()
{
    std::string devicePinDataEndpoint = "/api/v1/me/devices/";
    devicePinDataEndpoint.append(remoteDeviceId);

    for (int i = 0; i < pins.size(); i++)
    {
        std::string mode = pins[i].mode;
        if (mode == SENSOR)
        {
            std::string endpoint(devicePinDataEndpoint);
            endpoint.append("/sensors/");
            endpoint.append(pins[i].pinString);
            std::string postBody = "{\"value\":";
            float h = dht.readHumidity();
            float t = dht.readTemperature();
            Serial.print("temperature: ");
            Serial.println(t);
            Serial.print("humidity: ");
            Serial.println(h);
            std::string humidity = std::to_string(h);
            postBody.append(humidity);
            postBody.append("}");

            std::string respOfRegisterPin = ItemhubUtilities::Send(client, apiEndpoint, caPem, POST, endpoint, postBody, token);

            Serial.print("Sensor: ");
            Serial.println(respOfRegisterPin.c_str());
        }
    }
}