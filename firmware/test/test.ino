#include <string>
#include <ArduinoJson.h>
#include <ArduinoUniqueID.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include "ItemhubUtilities/ItemhubUtilities.h"
#include "ItemhubUtilities/Certs.h"

#ifndef STASSID
#define STASSID "Peter Home"
#define STAPSK "tdJ2k7wbeMvw"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;
const char *host = "itemhub.io";
const uint16_t port = 443;
long remoteDeviceId = -1;
char *token;

void setup()
{
  delay(5000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Set time via NTP, as required for x.509 validation
  configTime(3 * 60 * 60, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2)
  {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.print("Current time: ");
  Serial.print(asctime(&timeinfo));

  char *resp = ItemhubUtilities::Send((char *)host, LET_ENCRYPT_CA_PEM, "GET", "/api/v1/test", "", "");
  JsonObject json = ItemhubUtilities::GetResponseBody(resp);
  const char *project = json["project"].as<const char *>();
  Serial.print("project: ");
  Serial.println(project);

  token = ItemhubUtilities::Auth((char *)host, LET_ENCRYPT_CA_PEM);
  Serial.print("token: ");
  Serial.println(token);

  remoteDeviceId = ItemhubUtilities::GetRemoteDeviceId((char *)host, LET_ENCRYPT_CA_PEM, token);
  Serial.print("remote device id: ");
  Serial.println(remoteDeviceId);
}

void loop()
{
}