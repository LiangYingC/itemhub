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
std::string host = "itemhub.io";
const uint16_t port = 443;
std::string remoteDeviceId;
std::string token;
std::string empty = "";
WiFiClientSecure client;

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

  // setup Root CA pem.
  X509List x509cert(CA_PEM);
  client.setTrustAnchors(&x509cert);
  // connect HTTPS server.
  if (!client.connect(host.c_str(), port))
  {
    Serial.println("Connection failed");
  }
  int port = 443;
  client.connect(host.c_str(), 443);

  token = ItemhubUtilities::Auth(client, host);
  Serial.print("token: ");
  Serial.println(token.c_str());

  remoteDeviceId = ItemhubUtilities::GetRemoteDeviceId(client, host, token);
  Serial.print("remote device id: ");
  Serial.println(remoteDeviceId.c_str());
}

void loop()
{
  ItemhubUtilities::Online(client, host, remoteDeviceId, token);
  delay(2000);
}