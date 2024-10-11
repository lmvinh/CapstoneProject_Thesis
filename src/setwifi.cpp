#include "setwifi.h"

const char* ssid = "Sebastian";
const char* password = "khongcopassma";
IPAddress staticIP(192, 168, 137, 190);
IPAddress gateway(192,168,137,248); 
IPAddress subnet(255, 255, 255, 0); 
IPAddress primaryDNS(192,168,137,248);
IPAddress secondaryDNS(0, 0, 0,0);

void wifiSetup() {
    Serial.print("Connecting to Wi-Fi ");
    WiFi.mode(WIFI_STA);
    WiFi.config(staticIP, gateway, subnet, primaryDNS, secondaryDNS);
    WiFi.begin(ssid, password);

    unsigned long startTime = millis();
    unsigned long timeout = 10000;
    while (WiFi.status() != WL_CONNECTED && millis() - startTime < timeout) {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi connected.");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nWiFi connection failed!");
    }
}