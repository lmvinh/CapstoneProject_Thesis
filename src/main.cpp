#include <Arduino.h>
#include "M5UnitENV.h"
#include "M5Atom.h"
#include "string.h"
#include "Unit_4RELAY.h"

#include "nbiot.h"

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
	GET_toggle_relay
};

// ENVIII:
// SHT30:   temperature and humidity sensor  I2C: 0x44
// QMP6988: absolute air pressure sensor     I2C: 0x70

float qmp_Pressure = 0.0;
float sht30_Temperature = 0.0;
float sht30_Humidity = 0.0;
int n_average = 1;

// WiFi network configuration:
#include "WiFi.h"

// WiFi credentials
// const char* ssid = "Misfit";
// const char* password = "12356789";
const char* ssid = "ACLAB";
const char* password = "ACLAB2023";
WiFiClient myclient;
WiFiServer server(80);

// GET request types
#define GET_unknown 0
#define GET_index_page 1
#define GET_favicon 2
#define GET_logo 3
#define GET_script 4
int html_get_request;

#include "index.h"
UNIT_4RELAY relay;

// IPAddress staticIP(192, 168, 1, 185); 
// IPAddress gateway(192, 168, 1, 1);    
// IPAddress subnet(255, 255, 255, 0);   
// IPAddress primaryDNS(192, 168, 1, 1); 
// IPAddress secondaryDNS(0, 0, 0, 0);

IPAddress staticIP(172, 28, 182, 185); 
IPAddress gateway(172, 28, 182, 1);    
IPAddress subnet(255, 255, 255, 0);   
IPAddress primaryDNS(172, 28, 182, 1); 
IPAddress secondaryDNS(0, 0, 0, 0);
void turnRelay(uint8_t relayNum, int state);
bool parseRelayRequest(String request, int &relayNum, int &state);
void publishEnv(String value);
void publishRelay(String value);
void publishRelayStates() ;
void I2Cscan();
boolean connect_Wifi();
SHT4X sht4;
BMP280 bmp;

void setup() {
	M5.begin(true, false, true);
	Wire.begin(25, 21);         
	relay.begin(&Wire, 25, 21);
	relay.Init(1);
	delay(50); 
	M5.dis.fillpix(LED_ERROR); 
	Serial.println("M5ATOM ENV monitor");
	Serial.println("v1.0 | 26.11.2021");
	relay.relayAll(0);
	I2Cscan();
	WiFi.mode(WIFI_STA);
	WiFi.disconnect();
	delay(1000);
	connect_Wifi();
	SetupNbiot();

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
	next_millis = millis() + 5000;
	//publishEnv("hello topic!!");
}

void loop() {
	mainTainMqtt();
	unsigned long current_millis = millis();
	
	if (current_millis >= next_millis) {
		Serial.println("Measure");
		next_millis = current_millis + 3600000;  // Set the next measurement to happen in one hour
		M5.dis.fillpix(LED_MEASURE);  // Visual feedback for the measurement

		if (sht4.getHeater() != 0) {
			return;  // Skip measurement if the heater is active
		}

		if (sht4.update() && bmp.update()) {
			qmp_Pressure = ((qmp_Pressure * (n_average - 1)) + bmp.pressure) / n_average;
			sht30_Temperature = ((sht30_Temperature * (n_average - 1)) + sht4.cTemp) / n_average;
			sht30_Humidity = ((sht30_Humidity * (n_average - 1)) + sht4.humidity) / n_average;

			String payload = "{\"temp\":" + String(sht30_Temperature, 2) + ",\"humi\":" + String(sht30_Humidity, 2) + ",\"air\":" + String(qmp_Pressure / 100.0F, 2) + "}";

			publishEnv(payload);  // Publish the measurement data to the server

			if (n_average < 10) {
				n_average++;  // Increment the averaging factor up to a maximum of 10
			}
		}
	}

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
						// Process GET requests
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
								int relayNum = 0, state = 0;
								if (parseRelayRequest(request, relayNum, state)) {
									if (relayNum >= 0 && relayNum <= 3) {
										relay.relayWrite(relayNum, state);
										publishRelayStates();
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

boolean connect_Wifi() {
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
		M5.dis.fillpix(LED_OK);
		return true;
	} else {
		Serial.println("\nWiFi connection failed!");
		M5.dis.fillpix(LED_ERROR);
		return false;
	}
}


void publishRelayStates() {
	// Assume relay states are stored in a boolean array or similar
	bool relayStates[4];  // Assuming you have 4 relays

	// Retrieve the state of each relay (0 or 1)
	for (int i = 0; i < 4; i++) {
		relayStates[i] = relay.readRelay(i);  // Modify this line according to your relay reading method
	}

	// Create the JSON payload
	String payload = "{\"relay1\":" + String(relayStates[0] ? "true" : "false") +
					 ",\"relay2\":" + String(relayStates[1] ? "true" : "false") +
					 ",\"relay3\":" + String(relayStates[2] ? "true" : "false") +
					 ",\"relay4\":" + String(relayStates[3] ? "true" : "false") + "}";

	// Publish to the server
	publishRelay(payload);
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


// // Define MQTT server settings
// #define MQTT_SERVER   "mqttserver.tk"
// #define MQTT_PORT     1883
// #define MQTT_USERNAME "innovation"
// #define MQTT_PASSWORD "Innovation_RgPQAZoA5N"
// #define MQTT_U_TOPIC_ENV "/innovation/airmonitoring/WSNs/ABC/env"  //  Upload data topic


// #include "M5_SIM7080G.h"

// // Global instances

// M5_SIM7080G device;

// String readstr;

// // Logging function to output to Serial and Screen
// void log(String str) {
// 	Serial.print(str);

// }

// void setup() {
// 	// Initialize M5Stack and display
// 	M5.begin(true,false,true);


// 	// Initialize SIM7080G module with Serial2 on pins 16 (RX) and 17 (TX)
// 	device.Init(&Serial2, 19, 22);

// 	// Reboot the module
// 	device.sendMsg("AT+CREBOOT\r\n");
// 	delay(1000);

// 	// Wait until a valid signal quality is obtained
// 	while (true) {
// 		device.sendMsg("AT+CSQ\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);
// 		if (readstr.indexOf("+CSQ: 99,99") == -1) {
// 			break;
// 		}
// 	}

// 	// Establish the network connection
// 	while (true) {
// 		device.sendMsg("AT+CNACT=0,1\r\n");
// 		readstr = device.waitMsg(200);
// 		log(readstr);

// 		device.sendMsg("AT+CNACT?\r\n");
// 		readstr = device.waitMsg(200);
// 		log(readstr);

// 		device.sendMsg("AT+SMCONF=\"URL\",\"mqttserver.tk\",\"1883\"\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);
		
// 		device.sendMsg("AT+SMCONF=\"USERNAME\",\"" + String(MQTT_USERNAME) + "\"\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);

// 		device.sendMsg("AT+SMCONF=\"PASSWORD\",\"" + String(MQTT_PASSWORD) + "\"\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);
		
// 		device.sendMsg("AT+SMCONF=\"KEEPTIME\",60\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);

// 		device.sendMsg("AT+SMCONF=\"CLEANSS\",1\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);

// 		device.sendMsg("AT+SMCONF=\"CLIENTID\",\"simmqtt\"\r\n");
// 		readstr = device.waitMsg(1000);
// 		log(readstr);

// 		device.sendMsg("AT+SMCONN\r\n");
// 		readstr = device.waitMsg(10000);
// 		log(readstr);

// 		// If connection is successful (no ERROR in the response), exit the loop
// 		if (readstr.indexOf("ERROR") == -1) {
// 			break;
// 		}
// 	}

// 	// Subscribe to the topic


// }

// void loop() {
// 	// Update the M5Stack's button status
// 	M5.update();

// 	// Check if BtnA is pressed and publish a message
// 	if (M5.Btn.wasPressed()) {
// 		float temp = 25 + static_cast<float>(random(0, 10000)) / 10000.0 * 7.0;  // temp from 25 to 32
// 	float humi = 50 + static_cast<float>(random(0, 10000)) / 10000.0 * 10.0; // humi from 50 to 60
// 	float air = 90 + static_cast<float>(random(0, 10000)) / 10000.0 * 10.0;  // air from 90 to 100

// // Create the JSON payload
// 		String payload = "{\"temp\":" + String(temp, 2) + ",\"humi\":" + String(humi, 2) + ",\"air\":" + String(air, 2) + "}";	
// 		device.sendMsg("AT+SMPUB=\"/innovation/airmonitoring/WSNs/ABC/env\","+ String(payload.length()) +",1,1\r\n");
// 		delay(100);
// 		device.sendMsg(payload);
// 	}

// 	// Continuously read incoming messages and display them
// 	readstr = device.waitMsg(0);
// 	Serial.print(readstr);
// 	log(readstr);
// }
