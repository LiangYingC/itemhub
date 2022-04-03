#include <string>
#include <vector>
#include "DHT/DHT.h"
#include "ItemhubUtilities/ItemhubUtilities.h"
#include "ca-pem.h"

#define DHTPIN D1
#define DHTTYPE DHT11

#define SWITCH "SWITCH"
#define SENSOR "SENSOR"

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

    std::string resp;
    bool respFlag = false;

    int postBodyLength = emptyString.length();
    // Send request to HTTPS web server.
    int len = sprintf((char *)buff, "%s %s HTTP/1.1\r\nHost: %s\r\nContent-Type: application/json\r\nAuthorization: Bearer %s\r\nContent-Length: %d\r\n\r\n%s", POST.c_str(), deviceOnlineEndpoint.c_str(), apiEndpoint.c_str(), token.c_str(), postBodyLength, emptyString.c_str());
    client.write(buff, len);
    // GET HTTPS response.
    memset(buff, 0, sizeof(buff));
    while (1)
    {
        memset(buff, 0, sizeof(buff));
        int ret = client.read(buff, sizeof(buff) - 1);
        if (ret == MBEDTLS_ERR_SSL_WANT_READ)
        {
            if (respFlag == true)
            {
                respFlag = false;
                break;
            }
            delay(100);
            continue;
        }
        else if (ret <= 0)
        {
            break;
        }
        else if (ret > 0)
        {
            respFlag = true;
            // char tempReuslt[sizeof(buff) + 1];
            // memcpy(tempReuslt, buff, sizeof(buff) + 1);
            // resp += (char *)buff;
        }
    }

    // std::string status = ItemhubUtilities::Extract(resp, "status");
    // Serial.println(status.c_str());
    Serial.println("Update State Http Status ");
}
