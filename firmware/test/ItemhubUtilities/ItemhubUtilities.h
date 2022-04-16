#include <string>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <ArduinoUniqueID.h>

class ItemhubUtilities
{
public:
    static std::string Online(WiFiClientSecure &client, std::string &host, std::string &remoteDeviceId, std::string &token)
    {
        std::string deviceOnlineEndpoint = "/api/v1/me/devices/";
        deviceOnlineEndpoint.append(remoteDeviceId);
        deviceOnlineEndpoint.append("/online");
        Serial.println("Update State Http Status Start");
        std::string emptyString = "";
        std::string resp = ItemhubUtilities::Send(client, host, "POST", deviceOnlineEndpoint, emptyString, token);
        Serial.println("testing 3");
        Serial.println(resp.c_str());
        Serial.println("testing 4");
        // std::string status = ItemhubUtilities::Test(resp, "status");
    }
    static std::string Auth(WiFiClientSecure &client, std::string &host)
    {
        std::string postBody = "{\"clientId\":\"miterfrants@gmail.com\",\"clientSecret\":\"@Testing123123\"}";
        std::string authEndpoint = "/api/v1/oauth/exchange-token-for-device";
        std::string emptyToken = "";
        std::string resp = Send(client, host, "POST", authEndpoint, postBody, emptyToken);
        JsonObject respObj = GetResponseBody(resp);
        std::string token = respObj["token"].as<std::string>();
        return token;
    }

    static std::string GetRemoteDeviceId(WiFiClientSecure &client, std::string &host, std::string &token)
    {
        String deviceId;
        for (size_t i = 0; i < UniqueIDsize; i++)
        {
            String temp(UniqueID[i], HEX);
            deviceId += temp;
        }

        std::string deviceIdEndPoint = "/api/v1/me/devices/by-device-id/";
        deviceIdEndPoint.append(deviceId.c_str());
        std::string emptyBody = "";
        std::string resp = Send(client, host, "GET", deviceIdEndPoint, emptyBody, token);
        int checkDeviceExistsResponseStatus = GetHttpStatus(resp);

        if (checkDeviceExistsResponseStatus == 404)
        {
            std::string registerDeviceBody = "{\"deviceId\":\"";
            registerDeviceBody.append(deviceId.c_str());
            registerDeviceBody.append("\",\"name\":\"");
            registerDeviceBody.append(deviceId.c_str());
            registerDeviceBody.append("\"}");
            std::string endPoint = "/api/v1/me/devices";
            resp = Send(client, host, "POST", endPoint, registerDeviceBody, token);
        }

        JsonObject respObj = GetResponseBody(resp);
        return respObj["id"].as<std::string>();
    }

    static std::string Send(WiFiClientSecure &client, std::string &host, char *method, std::string &path, std::string &postBody, std::string &token)
    {
        unsigned char buff[256];
        bool respFlag = false;
        int port = 443;
        Serial.println("test -1");
        std::string result = "";

        int postBodyLength = postBody.length();

        if (method == "GET")
        {
            client.print(String(method) + " " + path.c_str() + " HTTP/1.1\r\n" +
                         "Host: " + host.c_str() + "\r\n" +
                         "Content-Type: application/json\r\n" +
                         "Authorization: Bearer " + token.c_str() + "\r\n" +
                         "Connection: close\r\n\r\n");
            while (client.connected())
            {
                char c = client.read();
                result += c;
            }
        }
        else
        {
            Serial.println("test 0");
            int len = sprintf((char *)buff, "%s %s HTTP/1.1\r\nHost: %s\r\nContent-Type: application/json\r\nAuthorization: Bearer %s\r\nContent-Length: %d\r\n\r\n%s", method, path.c_str(), host.c_str(), token.c_str(), postBodyLength, postBody.c_str());
            Serial.println("test 1");
            client.write(buff, len);
            Serial.println("test 2");
            while (client.connected() && client.available())
            {
                char c = client.read();
                result += c;
            }
        }
        Serial.println("Send end");
        return result;
    }

    static int GetHttpStatus(std::string &resp)
    {
        size_t startOfHttpMeta = resp.find("HTTP/1.1");
        if (startOfHttpMeta != std::string::npos)
        {
            std::string httpStatus = resp.substr(startOfHttpMeta + 9, 3);
            return std::stoi(httpStatus);
        }
        return 500;
    }

    static JsonObject GetResponseBody(std::string &resp)
    {
        StaticJsonDocument<1024> jsonBuffer;

        size_t endOfHeader = resp.find("\r\n\r\n");
        size_t startOfContentLength = resp.find("\r\n", endOfHeader + 1);

        size_t startOfJsonObject = resp.find("{", endOfHeader);
        std::string rawContentLength = resp.substr(startOfContentLength, startOfJsonObject - startOfContentLength - 1);
        unsigned int contentLength = std::stoul(rawContentLength, nullptr, 16);
        if (startOfJsonObject != std::string::npos)
        {
            std::string header = resp.substr(0, endOfHeader);
            std::string body = resp.substr(startOfJsonObject, contentLength);
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