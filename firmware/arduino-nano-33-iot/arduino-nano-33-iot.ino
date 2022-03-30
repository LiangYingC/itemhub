#include <ArduinoHttpClient.h>
#include <WiFiNINA.h>
#include <DHT.h>
#include <vector>
#include <string>
#include <ArduinoUniqueID.h>
#include "tiny-json.h"
#include "ItemhubUtilities.h"

#define DHTPIN 2
#define D0 0
#define REBOOT_PIN 4
#define DHTTYPE DHT11
#define _DEBUG_ true
#define SWITCH "SWITCH"
#define SENSOR "SENSOR"
#define ERROR_THEN_RECONNECT(client)                                        \
    int httpStatus = client.responseStatusCode();                           \
    if (httpStatus == HTTP_ERROR_API || httpStatus == HTTP_ERROR_TIMED_OUT) \
    {                                                                       \
        disconnect();                                                       \
        connect();                                                          \
        return;                                                             \
    }

char ssid[] = "Peter Home";
char pass[] = "tdJ2k7wbeMvw";

const char serverName[] = "itemhub.io";
int port = 443;

WiFiSSLClient sslClient;
HttpClient client = HttpClient(sslClient, serverName, port);

bool printWebData = true;
int wifiStatus = WL_IDLE_STATUS;

const int intervalSensor = 30 * 1000;
const int intervalSwitch = 2000;
const int intervalDeviceState = 2000;

int timeoutCount = 0;
long loopCount = 0;

unsigned long currentSensorTimestamp;
unsigned long previousSensorTimestamp;
unsigned long currentDeviceStateTimestamp;
unsigned long previousDeviceStateTimestamp;
unsigned long currentSwitchTimestamp;
unsigned long previousSwitchTimestamp;

std::string token;
std::string remoteDeviceId;
std::string projectName;
std::string tokenHeader;
std::vector<ItemhubPin> pins;

DHT dht(DHTPIN, DHTTYPE);

void setup()
{
    pins.push_back(ItemhubPin(D0, "D0", SWITCH));
    pins.push_back(ItemhubPin(DHTPIN, "D2", SENSOR));
    dht.begin();

    connect();
    String fv = WiFi.firmwareVersion();
    Serial.println(fv.c_str());

    // itemhub authorized
    auth();
    Serial.println("authorized");

    // itemhub setup remote device id
    setupRemoteDeviceId();
    Serial.println("setup remote device id");

    tokenHeader = "Authorization: Bearer ";
    tokenHeader.append(token);
}

void loop()
{
    // itemhub device state
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

void connect()
{

    while (wifiStatus != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to network: ");
        Serial.println(ssid);
        wifiStatus = WiFi.begin(ssid, pass);
        delay(10000);
    }
    client = HttpClient(sslClient, serverName, port);
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);
}

void disconnect()
{
    while (wifiStatus != WL_DISCONNECTED)
    {
        Serial.println("disconnect");
        WiFi.disconnect();
        wifiStatus = WiFi.status();
        delay(3000);
    }

    Serial.println(wifiStatus);
    WiFi.end();
    delay(5000);
}

void auth()
{
    std::string postData = "{\"clientId\":\"miterfrants@gmail.com\",\"clientSecret\":\"@Testing123123\"}";
    client.post("/api/v1/oauth/exchange-token-for-device", "application/json", postData.c_str());
    std::string body = std::string(client.responseBody().c_str());
    token = ItemhubUtilities::Extract(body, "token");
}

void setupRemoteDeviceId()
{
    String deviceId;
    for (size_t i = 0; i < UniqueIDsize; i++)
    {
        String temp(UniqueID[i], HEX);
        deviceId += temp;
    }

    std::string byDeviceIdEndPoint = "/api/v1/me/devices/by-device-id/";
    byDeviceIdEndPoint.append(deviceId.c_str());

    client.beginRequest();
    client.get(byDeviceIdEndPoint.c_str());
    std::string tokenHeader = "Authorization: Bearer ";
    tokenHeader.append(token);
    client.sendHeader(tokenHeader.c_str());
    client.endRequest();

    int checkDeviceExistsResponseStatus = client.responseStatusCode();
    std::string resp = std::string(client.responseBody().c_str());
    if (checkDeviceExistsResponseStatus == 404)
    {
        Serial.println("register new device");
        std::string registerDeviceBody = "{\"deviceId\":\"";
        registerDeviceBody.append(deviceId.c_str());
        registerDeviceBody.append("\",\"name\":\"");
        registerDeviceBody.append(deviceId.c_str());
        registerDeviceBody.append("\"}");
        client.beginRequest();
        client.post("/api/v1/me/devices");
        client.sendHeader("Content-Type", "application/json");
        client.sendHeader("Content-Length", registerDeviceBody.size());
        client.sendHeader(tokenHeader.c_str());
        client.beginBody();
        client.print(registerDeviceBody.c_str());
        client.endRequest();
        resp = std::string(client.responseBody().c_str());
    }

    remoteDeviceId = ItemhubUtilities::Extract(resp, "id");
}

void online()
{
    std::string deviceOnlineEndpoint = "/api/v1/me/devices/";
    deviceOnlineEndpoint.append(remoteDeviceId);
    deviceOnlineEndpoint.append("/online");

    client.beginRequest();
    client.post(deviceOnlineEndpoint.c_str());
    client.sendHeader("Content-Type", "application/json");
    client.sendHeader("Content-Length", 0);
    client.sendHeader(tokenHeader.c_str());
    client.endRequest();

    Serial.println("Update State Http Status ");
    ERROR_THEN_RECONNECT(client);
}

void checkSwitchState()
{
    Serial.println("check switch state");
    std::string deviceStateEndpoint = "/api/v1/me/devices/";
    deviceStateEndpoint.append(remoteDeviceId);
    deviceStateEndpoint.append("/switches");

    client.beginRequest();
    client.get(deviceStateEndpoint.c_str());
    client.sendHeader(tokenHeader.c_str());
    client.endRequest();
    ERROR_THEN_RECONNECT(client);

    std::string resp = std::string(client.responseBody().c_str());
    resp.insert(0, "{\"data\":");
    resp.append("}");
    json_t const *jsonData = json_create((char *)resp.c_str(), pool, MAX_FIELDS);
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

            client.beginRequest();
            client.post(endpoint.c_str());
            client.sendHeader("Content-Type", "application/json");
            client.sendHeader("Content-Length", postBody.size());
            client.sendHeader(tokenHeader.c_str());
            client.beginBody();
            client.print(postBody.c_str());
            client.endRequest();
            ERROR_THEN_RECONNECT(client);

            Serial.print("register new pin: ");
            Serial.println(client.responseBody().c_str());
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

            client.beginRequest();
            client.post(endpoint.c_str());
            client.sendHeader("Content-Type", "application/json");
            client.sendHeader("Content-Length", postBody.size());
            client.sendHeader(tokenHeader.c_str());
            client.beginBody();
            client.print(postBody.c_str());
            client.endRequest();
            ERROR_THEN_RECONNECT(client);

            Serial.print("Sensor: ");
            Serial.println(client.responseBody().c_str());
        }
    }
}