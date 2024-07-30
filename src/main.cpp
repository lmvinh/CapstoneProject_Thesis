/******************************************************************************
 * M5ATOM ENV web-monitor
 * A simple web server to display the environment sensor data as a web page.
 * 
 * Hague Nusseck @ electricidea
 * v1.0 | 26.November.2021
 * https://github.com/electricidea/M5ATOM/tree/master/ATOM-Web-Monitor
 * 
 * 
 * used Resources:
 * https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFi/examples/SimpleWiFiServer/SimpleWiFiServer.ino
 * https://realfavicongenerator.net/
 * https://github.com/Jamesits/bin2array
 * https://www.deadnode.org/sw/bin2h/
 * https://html-css-js.com/css/generator/font/
 * 
 * Distributed as-is; no warranty is given.
 ******************************************************************************/
#include <Arduino.h>

#include "M5UnitENV.h"
#include "M5Atom.h"
#include "Unit_4RELAY.h"

// install the M5ATOM library:
// pio lib install "M5Atom"

// You also need the FastLED library
// https://platformio.org/lib/show/126/FastLED
// FastLED is a library for programming addressable rgb led strips 
// (APA102/Dotstar, WS2812/Neopixel, LPD8806, and a dozen others) 
// acting both as a driver and as a library for color management and fast math.
// install the library:
// pio lib install "fastled/FastLED"

#define LED_ERROR   0x110000
#define LED_OK      0x001100
#define LED_NETWORK 0x000011
#define LED_MEASURE 0x111111

unsigned long next_millis;

enum HTMLGetRequest {
    GET_unknown = 0,
    GET_index_page,
    GET_favicon,
    GET_logo,
    GET_script,
    GET_ajax_data,
    GET_toggle_relay  // New request type for relay toggling
};

// ENVIII:
// SHT30:   temperature and humidity sensor  I2C: 0x44
// QMP6988: absolute air pressure sensor     I2C: 0x70

float qmp_Pressure = 0.0;
float sht30_Temperature = 0.0;
float sht30_Humidity = 0.0;
int n_average = 1;

// WIFI and https client libraries:
#include "WiFi.h"
//#include <WiFiClientSecure.h>

// WiFi network configuration:
char wifi_ssid[33];
char wifi_key[65];
const char* ssid     = "ACLAB";
const char* password = "ACLAB2023";
// const char* ssid     = "Amercland";
// const char* password = "yenlam1507";
WiFiClient myclient;
WiFiServer server(80);

// GET 
#define GET_unknown 0
#define GET_index_page  1
#define GET_favicon  2
#define GET_logo  3
#define GET_script  4
int html_get_request;

#include "index.h"
UNIT_4RELAY relay;

//*********************Variables declaration**********************

// Replaces placeholder with button section in your web page

// Function to parse relay number and state from the request string
bool parseRelayRequest(String request, int &relayNum, int &state);

// forward declarations:
void I2Cscan();
boolean connect_Wifi();
SHT4X sht4;
BMP280 bmp;
// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastDebounceTime = 0; // the last time the output pin was toggled
unsigned long debounceDelay = 50; // the debounce time; increase if the output flickers
void setup() {
    // start the ATOM device with Serial and Display (one LED)
    M5.begin(true, false, true);
    Wire.begin(25, 21);         
    relay.begin(&Wire, 25, 21);
    relay.Init(1);  // Set the lamp and relay to synchronous mode
    delay(50); 
    M5.dis.fillpix(LED_ERROR); 
    Serial.println("M5ATOM ENV monitor");
    Serial.println("v1.0 | 26.11.2021");
    relay.relayAll(0);
    I2Cscan();
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    delay(5000);
    connect_Wifi();
    server.begin();     

    if (!sht4.begin(&Wire, SHT40_I2C_ADDR_44, 25, 21, 400000U)) {
        Serial.println("Couldn't find SHT4x");
        while (1) delay(1);
    }
    
    sht4.setPrecision(SHT4X_HIGH_PRECISION);
    sht4.setHeater(SHT4X_NO_HEATER);

    if (!bmp.begin(&Wire, BMP280_I2C_ADDR, 25, 21, 400000U)) {
        Serial.println("Couldn't find BMP280");
        while (1) delay(1);
    }
    
    bmp.setSampling(BMP280::MODE_NORMAL, 
                                    BMP280::SAMPLING_X2,     
                                    BMP280::SAMPLING_X16,    
                                    BMP280::FILTER_X16,      
                                    BMP280::STANDBY_MS_500); 
 
    next_millis = millis() + 5000; // Start after 5 seconds
}

void loop() {
    unsigned long current_millis = millis();

    if (current_millis > next_millis) {
        Serial.println("Measure");
        next_millis = current_millis + 3000; // Update every 3 seconds
        M5.dis.fillpix(LED_MEASURE);

        if (sht4.getHeater() != 0) {
            return;
        }

        if (sht4.update()) {
            qmp_Pressure = ((qmp_Pressure * (n_average - 1)) + bmp.pressure) / n_average;
            sht30_Temperature = ((sht30_Temperature * (n_average - 1)) + sht4.cTemp) / n_average;
            sht30_Humidity = ((sht30_Humidity * (n_average - 1)) + sht4.humidity) / n_average;

            if (n_average < 10)
                n_average++;
        }
    }

    // Handle HTTP requests
    WiFiClient client = server.available();
    if (client) {
        unsigned long timeout_millis = millis() + 5000;
        M5.dis.fillpix(LED_NETWORK);
        Serial.println("New Client.");
        String currentLine = "";
        String request = "";

        while (client.connected()) {
            if (millis() > timeout_millis) {
                Serial.println("Force Client stop!");
                client.stop();
            }

            if (client.available()) {
                char c = client.read();
                Serial.write(c);
                request += c;

                if (c == '\n') {
                    if (currentLine.length() == 0) {
                        // Parse the request and determine the GET request type
                        if (request.startsWith("GET / ")) {
                            html_get_request = GET_index_page;
                        } else if (request.startsWith("GET /script")) {
                            html_get_request = GET_script;
                        } else if (request.startsWith("GET /ajax_data")) {
                            html_get_request = GET_ajax_data;
                        } else if (request.startsWith("GET /toggle")) {
                            html_get_request = GET_toggle_relay;
                        } else {
                            html_get_request = GET_unknown;
                        }

                        // Handle the request
                        switch (html_get_request) {
                            case GET_index_page: {
                                client.println("HTTP/1.1 200 OK");
                                client.println("Content-type:text/html");
                                client.println();
                                client.write_P(index_html, sizeof(index_html));
                                break;
                            }
                            case GET_script: {
                                client.println("HTTP/1.1 200 OK");
                                client.println("Content-type:application/javascript");
                                client.println();
                                client.printf("var temperatureValue = %3.2f;\n", sht30_Temperature);
                                client.printf("var humidityValue = %3.2f;\n", sht30_Humidity);
                                client.printf("var pressureValue = %3.2f;\n", qmp_Pressure / 100.0F);
                                break;
                            }
                            case GET_ajax_data: {
                                client.println("HTTP/1.1 200 OK");
                                client.println("Content-type:application/json");
                                client.println();
                                client.printf("{\"temperature\":%3.2f,\"humidity\":%3.2f,\"pressure\":%3.2f}\n", sht30_Temperature, sht30_Humidity, qmp_Pressure / 100.0F);
                                break;
                            }
                            case GET_toggle_relay: {
                                // Manually parse relay number and state from the request string
                                int relayNum = 0, state = 0;
                                if (parseRelayRequest(request, relayNum, state)) {
                                    // Ensure relayNum is between 0 and 3
                                    if (relayNum >= 0 && relayNum <= 3) {
                                        relay.relayWrite(relayNum, state);  // Use relayWrite to set the relay state
                                        Serial.printf("Relay %d set to %d\n", relayNum, state);
                                    } else {
                                        Serial.println("Invalid relay number!");
                                    }
                                }

                                client.println("HTTP/1.1 200 OK");
                                client.println("Content-type:text/plain");
                                client.println();
                                client.println("OK");
                                break;
                            }
                            default:
                                client.println("HTTP/1.1 404 Not Found");
                                client.println();
                                break;
                        }
                        client.println();
                        break;
                    } else {
                        currentLine = "";
                    }
                } else if (c != '\r') {
                    currentLine += c;
                }
            }
        }
        client.stop();
        Serial.println("Client Disconnected.");
    }
}

// Scan I2C devices
void I2Cscan() {
    byte error, address;
    int nDevices;
    Serial.println("Scanning...");
    nDevices = 0;
    for (address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        error = Wire.endTransmission();
        if (error == 0) {
            Serial.print("I2C device found at address 0x");
            if (address < 16) {
                Serial.print("0");
            }
            Serial.print(address, HEX);
            Serial.println("  !");
            nDevices++;
            delay(500);
        } else if (error == 4) {
            Serial.print("Unknown error at address 0x");
            if (address < 16) {
                Serial.print("0");
            }
            Serial.println(address, HEX);
        }
    }
    if (nDevices == 0) {
        Serial.println("No I2C devices found\n");
    } else {
        Serial.println("done\n");
    }
}

// Connect to WiFi
boolean connect_Wifi() {
    Serial.print("Connecting to ");
    Serial.print(ssid);
    WiFi.begin(ssid, password);
    int i = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        if (i++ > 60) {
            Serial.println("Timeout, resetting...");
            ESP.restart();
        }
    }
    Serial.println("Connected!");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    return true;
}
bool parseRelayRequest(String request, int &relayNum, int &state) {
    int relayIndex = request.indexOf("relay=");
    int stateIndex = request.indexOf("state=");

    if (relayIndex != -1 && stateIndex != -1) {
        relayNum = request.substring(relayIndex + 6, request.indexOf('&', relayIndex)).toInt();
        state = request.substring(stateIndex + 6, request.indexOf(' ', stateIndex)).toInt();
        return true;
    }
    return false;
}