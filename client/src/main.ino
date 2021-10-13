#include <string>
#include "TlsTcpClient.h"
#include "SparkJson/SparkJson.h"

//
// This example connect to the Let's Encrypt HTTPS server.
// Let's Encrypt ROOT Ca PEM file is here ( https://letsencrypt.org/certificates/ )
// If you want to use other Root CA, check your server administrator or own Root CA pem.
//
#define LET_ENCRYPT_CA_PEM                                                 \
    "-----BEGIN CERTIFICATE----- \r\n"                                     \
    "MIIFjTCCA3WgAwIBAgIRANOxciY0IzLc9AUoUSrsnGowDQYJKoZIhvcNAQELBQAw\r\n" \
    "TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh\r\n" \
    "cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTYxMDA2MTU0MzU1\r\n" \
    "WhcNMjExMDA2MTU0MzU1WjBKMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3Mg\r\n" \
    "RW5jcnlwdDEjMCEGA1UEAxMaTGV0J3MgRW5jcnlwdCBBdXRob3JpdHkgWDMwggEi\r\n" \
    "MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCc0wzwWuUuR7dyXTeDs2hjMOrX\r\n" \
    "NSYZJeG9vjXxcJIvt7hLQQWrqZ41CFjssSrEaIcLo+N15Obzp2JxunmBYB/XkZqf\r\n" \
    "89B4Z3HIaQ6Vkc/+5pnpYDxIzH7KTXcSJJ1HG1rrueweNwAcnKx7pwXqzkrrvUHl\r\n" \
    "Npi5y/1tPJZo3yMqQpAMhnRnyH+lmrhSYRQTP2XpgofL2/oOVvaGifOFP5eGr7Dc\r\n" \
    "Gu9rDZUWfcQroGWymQQ2dYBrrErzG5BJeC+ilk8qICUpBMZ0wNAxzY8xOJUWuqgz\r\n" \
    "uEPxsR/DMH+ieTETPS02+OP88jNquTkxxa/EjQ0dZBYzqvqEKbbUC8DYfcOTAgMB\r\n" \
    "AAGjggFnMIIBYzAOBgNVHQ8BAf8EBAMCAYYwEgYDVR0TAQH/BAgwBgEB/wIBADBU\r\n" \
    "BgNVHSAETTBLMAgGBmeBDAECATA/BgsrBgEEAYLfEwEBATAwMC4GCCsGAQUFBwIB\r\n" \
    "FiJodHRwOi8vY3BzLnJvb3QteDEubGV0c2VuY3J5cHQub3JnMB0GA1UdDgQWBBSo\r\n" \
    "SmpjBH3duubRObemRWXv86jsoTAzBgNVHR8ELDAqMCigJqAkhiJodHRwOi8vY3Js\r\n" \
    "LnJvb3QteDEubGV0c2VuY3J5cHQub3JnMHIGCCsGAQUFBwEBBGYwZDAwBggrBgEF\r\n" \
    "BQcwAYYkaHR0cDovL29jc3Aucm9vdC14MS5sZXRzZW5jcnlwdC5vcmcvMDAGCCsG\r\n" \
    "AQUFBzAChiRodHRwOi8vY2VydC5yb290LXgxLmxldHNlbmNyeXB0Lm9yZy8wHwYD\r\n" \
    "VR0jBBgwFoAUebRZ5nu25eQBc4AIiMgaWPbpm24wDQYJKoZIhvcNAQELBQADggIB\r\n" \
    "ABnPdSA0LTqmRf/Q1eaM2jLonG4bQdEnqOJQ8nCqxOeTRrToEKtwT++36gTSlBGx\r\n" \
    "A/5dut82jJQ2jxN8RI8L9QFXrWi4xXnA2EqA10yjHiR6H9cj6MFiOnb5In1eWsRM\r\n" \
    "UM2v3e9tNsCAgBukPHAg1lQh07rvFKm/Bz9BCjaxorALINUfZ9DD64j2igLIxle2\r\n" \
    "DPxW8dI/F2loHMjXZjqG8RkqZUdoxtID5+90FgsGIfkMpqgRS05f4zPbCEHqCXl1\r\n" \
    "eO5HyELTgcVlLXXQDgAWnRzut1hFJeczY1tjQQno6f6s+nMydLN26WuU4s3UYvOu\r\n" \
    "OsUxRlJu7TSRHqDC3lSE5XggVkzdaPkuKGQbGpny+01/47hfXXNB7HntWNZ6N2Vw\r\n" \
    "p7G6OfY+YQrZwIaQmhrIqJZuigsrbe3W+gdn5ykE9+Ky0VgVUsfxo52mwFYs1JKY\r\n" \
    "2PGDuWx8M6DlS6qQkvHaRUo0FMd8TsSlbF0/v965qGFKhSDeQoMpYnwcmQilRh/0\r\n" \
    "ayLThlHLN81gSkJjVrPI0Y8xCVPB4twb1PFUd2fPM3sA1tJ83sZ5v8vgFv2yofKR\r\n" \
    "PB0t6JzUA81mSqM3kxl5e+IZwhYAyO0OTg3/fs8HqGTNKd9BqoUwSRBzp06JMg5b\r\n" \
    "rUCGwbCUDI0mxadJ3Bz4WxR6fyNpBK2yAinWEsikxqEt\r\n"                     \
    "-----END CERTIFICATE----- "
const char letencryptCaPem[] = LET_ENCRYPT_CA_PEM;

#define ONE_DAY_MILLIS (24 * 60 * 60 * 1000)
unsigned long lastSync = millis();
char apiEndpoint[] = "iot.homo.tw";
int *successCount = 0;
std::string result = "";
bool respFlag = false;
std::string token = "";
int remoteDeviceId = -1;
StaticJsonBuffer<300> jsonBuffer;
JsonArray &pinData = jsonBuffer.createArray();

void setup()
{
    delay(5000);
    pinData.add(jsonBuffer.createObject());
    pinData[0]["pin"] = D0;
    pinData[0]["pinString"] = "D0";
    pinMode(D0, OUTPUT);

    pinData.add(jsonBuffer.createObject());
    pinData[1]["pin"] = D1;
    pinData[1]["pinString"] = "D1";
    pinMode(D1, OUTPUT);

    Serial.begin(9600);
    // need a Particle time sync for X509 certificates verify.
    if (millis() - lastSync > ONE_DAY_MILLIS)
    {
        Particle.syncTime();
        lastSync = millis();
    }
    // authorize
    char *resp = send("POST", "/api/v1/auth/sign-in-with-email", "{\"email\":\"miterfrants@gmail.com\",\"password\":\"@Testing123123\"}", "");
    JsonObject &jsonRespOfSignIn = getResponseBody(resp);
    token = jsonRespOfSignIn["token"].as<std::string>();
    // check device exists in remote server
    String deviceId = System.deviceID();
    std::string byDeviceIdEndPoint = "/api/v1/me/devices/by-device-id/";
    byDeviceIdEndPoint.append(deviceId);
    char *respOfGetDevice = send("GET", (char *)byDeviceIdEndPoint.c_str(), "", token.c_str());
    int status = getHttpStatus(respOfGetDevice);
    // if device not exists register new one
    if (status == 404)
    {
        Serial.println("register new device");
        std::string postBodyOfRegisterDevice("{\"deviceId\": \"\", \"name\": \"\"}");
        postBodyOfRegisterDevice.replace(14, 0, deviceId);
        postBodyOfRegisterDevice.replace(26 + deviceId.length(), 0, deviceId);
        Serial.println(postBodyOfRegisterDevice.c_str());
        char *respOfGetDevice = send("POST", "/api/v1/me/devices", (char *)postBodyOfRegisterDevice.c_str(), token.c_str());
    }
    // assign remoteDeviceId
    JsonObject &jsonResp = getResponseBody(respOfGetDevice);
    remoteDeviceId = jsonResp["id"].as<int>();
    // get all device states
    std::string stateEndPoint = "/api/v1/me/devices/";
    stateEndPoint.append(std::to_string(remoteDeviceId));
    stateEndPoint.append("/states");
    char *respOfStates = send("GET", (char *)stateEndPoint.c_str(), "", token.c_str());
    JsonArray &jsonStates = getResponseBodyArray(respOfStates);

    for (int i = 0; i < pinData.size(); i++)
    {
        bool isExists = false;
        for (int j = 0; j < jsonStates.size(); j++)
        {
            std::string pinString = pinData[i]["pinString"].asString();
            std::string pinStringFromRemote = jsonStates[j]["pin"].asString();
            if (pinString == pinStringFromRemote)
            {
                isExists = true;
                break;
            }
        }
        if (!isExists)
        {
            // create pin state
            char *respOfCreateStates = send("POST", (char *)stateEndPoint.c_str(), "", token.c_str());
        }
    }
}

void loop()
{
    if (remoteDeviceId == -1)
    {
        delay(30000);
        Serial.println("Device Not Exists");
        return;
    }
    std::string deviceStateEndpoint = "/api/v1/me/devices//states";
    std::string stringOfRemoteDeviceId = std::to_string(remoteDeviceId);
    deviceStateEndpoint.replace(19, 0, stringOfRemoteDeviceId);
    char *resp = send("GET", (char *)deviceStateEndpoint.c_str(), "", token.c_str());
    JsonArray &jsonRespOfDeviceStates = getResponseBodyArray(resp);
    for (int i = 0; i < jsonRespOfDeviceStates.size(); i++)
    {
        for (int j = 0; j < pinData.size(); j++)
        {
            std::string pinString = pinData[j]["pinString"].asString();
            std::string pinStringFromRemote = jsonRespOfDeviceStates[i]["pin"].asString();
            if (
                pinString == pinStringFromRemote)
            {
                double value = jsonRespOfDeviceStates[i]["value"].as<double>();
                int ceilValue = int(value);
                if (ceilValue == 0)
                {
                    digitalWrite(pinData[j]["pin"], LOW);
                }
                else
                {
                    digitalWrite(pinData[j]["pin"], HIGH);
                }
            }
        }
    }
    delay(2000);
}

int getHttpStatus(char *resp)
{
    std::string respStrOfGetDevice(resp);
    size_t startOfHttpMeta = respStrOfGetDevice.find("HTTP/1.1");
    if (startOfHttpMeta != std::string::npos)
    {
        std::string httpStatus = respStrOfGetDevice.substr(startOfHttpMeta + 9, 3);
        return std::stoi(httpStatus);
    }
    return 500;
}

JsonObject &getResponseBody(char *resp)
{
    StaticJsonBuffer<1024> jsonBuffer;
    std::string respStr(resp);
    size_t endOfHeader = respStr.find("\r\n\r\n");
    size_t startOfJsonObject = respStr.find("{", endOfHeader);
    if (startOfJsonObject != std::string::npos)
    {
        std::string header = respStr.substr(0, endOfHeader);
        std::string body = respStr.substr(startOfJsonObject, respStr.find_last_of("}") - startOfJsonObject + 1);
        JsonObject &respOfJson = jsonBuffer.parseObject((char *)body.c_str());
        if (!respOfJson.success())
        {
            Serial.println("parseObject() failed");
            return JsonObject::invalid();
        }
        return respOfJson;
    }

    return JsonObject::invalid();
}

JsonArray &getResponseBodyArray(char *resp)
{
    StaticJsonBuffer<1024> jsonBuffer;
    std::string respStr(resp);
    size_t endOfHeader = respStr.find("\r\n\r\n");
    size_t startOfJsonObject = respStr.find("[", endOfHeader);
    if (startOfJsonObject != std::string::npos)
    {
        std::string header = respStr.substr(0, endOfHeader);
        std::string body = respStr.substr(startOfJsonObject, respStr.find_last_of("]") - startOfJsonObject + 1);
        JsonArray &respOfJson = jsonBuffer.parseArray((char *)body.c_str());
        if (!respOfJson.success())
        {
            Serial.println("parseArray() failed");
            return JsonArray::invalid();
        }
        return respOfJson;
    }

    return JsonArray::invalid();
}

char *send(char *method, char *path, char *postBody, const char *token)
{
    unsigned char buff[256];
    TlsTcpClient client;
    // setup Root CA pem.
    client.init(letencryptCaPem, sizeof(letencryptCaPem));

    // connect HTTPS server.
    client.connect(apiEndpoint, 443);
    if (!client.verify())
    {
        // Serial.println("Server Certificates is in-valid.");
    }
    int postBodyLength = strlen(postBody);
    // Send request to HTTPS web server.
    int len = sprintf((char *)buff, "%s %s HTTP/1.1\r\nHost: %s\r\nContent-Type: application/json\r\nAuthorization: Bearer %s\r\nContent-Length: %d\r\n\r\n%s", method, path, apiEndpoint, token, postBodyLength, postBody);
    client.write(buff, len);

    // GET HTTPS response.
    memset(buff, 0, sizeof(buff));
    result = "";
    while (1)
    {
        // read renponse.
        memset(buff, 0, sizeof(buff));
        int ret = client.read(buff, sizeof(buff) - 1);
        // Serial.println(sizeof(buff));
        if (ret == MBEDTLS_ERR_SSL_WANT_READ)
        {
            if (respFlag == true)
            {
                respFlag = false;
                break;
            }
            delay(100);
            // Serial.println("aaaa");
            continue;
        }
        else if (ret <= 0)
        {
            // Serial.println("no response");
            break;
        }
        else if (ret > 0)
        {
            respFlag = true;
            // std::string value((char *)(buff));
            result += (char *)buff;
        }
    }
    return (char *)result.c_str();
}
