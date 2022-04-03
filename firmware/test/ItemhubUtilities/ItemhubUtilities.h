#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <ArduinoUniqueID.h>

class ItemhubUtilities
{
public:
    static char *Auth(char *host, char *cert)
    {
        String postBody = "{\"email\":\"miterfrants@gmail.com\",\"password\":\"@Testing123123\"}";
        char *resp = Send(host, cert, "POST", "/api/v1/auth/sign-in-with-email", (char *)postBody.c_str(), "");
        JsonObject respObj = GetResponseBody(resp);
        const char *token = respObj["token"].as<const char *>();
        return (char *)token;
    }

    static long GetRemoteDeviceId(char *host, char *cert, char *token)
    {
        String deviceId;
        for (size_t i = 0; i < UniqueIDsize; i++)
        {
            String temp(UniqueID[i], HEX);
            deviceId += temp;
        }

        std::string deviceIdEndPoint = "/api/v1/me/devices/by-device-id/";
        deviceIdEndPoint.append(deviceId.c_str());
        Serial.print("token: ");
        Serial.println(token);
        char *resp = Send(host, cert, "GET", (char *)deviceIdEndPoint.c_str(), "", token);
        int checkDeviceExistsResponseStatus = GetHttpStatus(resp);
        Serial.println();
        Serial.print("Get Device Id Status: ");
        Serial.println(checkDeviceExistsResponseStatus);

        if (checkDeviceExistsResponseStatus == 404)
        {
            Serial.println("Register new device");
            std::string registerDeviceBody = "{\"deviceId\":\"";
            registerDeviceBody.append(deviceId.c_str());
            registerDeviceBody.append("\",\"name\":\"");
            registerDeviceBody.append(deviceId.c_str());
            registerDeviceBody.append("\"}");
            resp = Send(host, cert, "POST", "/api/v1/me/devices", (char *)registerDeviceBody.c_str(), token);
        }

        JsonObject respObj = GetResponseBody(resp);
        long remoteDeviceId = respObj["id"].as<long>();
        return remoteDeviceId;
    }

    static char *Send(char *host, char *cert, char *method, char *path, char *postBody, char *token)
    {
        unsigned char buff[256];
        bool respFlag = false;
        int port = 443;
        std::string result = "";
        WiFiClientSecure client;

        // setup Root CA pem.
        X509List x509cert(cert);
        client.setTrustAnchors(&x509cert);

        // connect HTTPS server.
        if (!client.connect(host, port))
        {
            Serial.println("Connection failed");
            return "";
        }

        int postBodyLength = strlen(postBody);

        if (method == "GET")
        {
            Serial.print("token: ");
            Serial.println(token);
            String test = String(method) + " " + path + " HTTP/1.1\r\n" +
                          "Host: " + host + "\r\n" +
                          "Content-Type: application/json\r\n" +
                          "Authorization: Bearer " + token + "\r\n" +
                          "Connection: close\r\n\r\n";
            Serial.println(test);

            client.print(String(method) + " " + path + " HTTP/1.1\r\n" +
                         "Host: " + host + "\r\n" +
                         "Content-Type: application/json\r\n" +
                         "Authorization: Bearer " + token + "\r\n" +
                         "Connection: close\r\n\r\n");
            while (client.connected())
            {
                char c = client.read();
                result += c;
            }
        }
        else
        {
            int len = sprintf((char *)buff, "%s %s HTTP/1.1\r\nHost: %s\r\nContent-Type: application/json\r\nAuthorization: Bearer %s\r\nContent-Length: %d\r\n\r\n%s", method, path, host, token, postBodyLength, postBody);
            client.write(buff, len);
            delay(1200);
            while (client.available())
            {
                char c = client.read();
                result += c;
            }
        }

        return (char *)result.c_str();
    }

    static int GetHttpStatus(char *resp)
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

    static JsonObject GetResponseBody(char *resp)
    {
        StaticJsonDocument<1024> jsonBuffer;
        std::string respStr(resp);
        size_t endOfHeader = respStr.find("\r\n\r\n");
        size_t startOfContentLength = respStr.find("\r\n", endOfHeader + 1);

        size_t startOfJsonObject = respStr.find("{", endOfHeader);
        std::string rawContentLength = respStr.substr(startOfContentLength, startOfJsonObject - startOfContentLength - 1);
        unsigned int contentLength = std::stoul(rawContentLength, nullptr, 16);
        if (startOfJsonObject != std::string::npos)
        {
            std::string header = respStr.substr(0, endOfHeader);
            std::string body = respStr.substr(startOfJsonObject, contentLength);
            Serial.println(body.c_str());
            DeserializationError error = deserializeJson(jsonBuffer, body.c_str());
            if (error)
            {
                Serial.print("deserializeJson() failed: ");
                Serial.println(error.f_str());
                deserializeJson(jsonBuffer, "{}");
            }
        }
        else
        {
            Serial.println("Could not find json start");
            deserializeJson(jsonBuffer, "{}");
        }
        return jsonBuffer.as<JsonObject>();
    }

    static JsonArray GetResponseBodyAsArray(char *resp)
    {
        StaticJsonDocument<1024> jsonBuffer;
        std::string respStr(resp);
        size_t endOfHeader = respStr.find("\r\n\r\n");
        size_t startOfContentLength = respStr.find("\r\n", endOfHeader + 1);

        size_t startOfJsonObject = respStr.find("{", endOfHeader);
        std::string rawContentLength = respStr.substr(startOfContentLength, startOfJsonObject - startOfContentLength - 1);
        unsigned int contentLength = std::stoul(rawContentLength, nullptr, 16);
        if (startOfJsonObject != std::string::npos)
        {
            std::string header = respStr.substr(0, endOfHeader);
            std::string body = respStr.substr(startOfJsonObject, contentLength);
            DeserializationError error = deserializeJson(jsonBuffer, body.c_str());
            if (error)
            {
                Serial.print("deserializeJson() failed: ");
                Serial.println(error.f_str());
                deserializeJson(jsonBuffer, "[]");
            }
        }
        else
        {
            Serial.println("Could not find json start");
            deserializeJson(jsonBuffer, "[]");
        }
        return jsonBuffer.as<JsonArray>();
    }
};