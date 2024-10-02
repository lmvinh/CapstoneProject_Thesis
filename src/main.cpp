#include <Arduino.h>
#include "M5UnitENV.h"
#include "M5Atom.h"
#include "string.h"
#include "Unit_4RELAY.h"
#include "ArduinoJson.h"
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
	GET_toggle_relay,
	GET_relay_status
};

// ENVIII:
// SHT30:   temperature and humidity sensor  I2C: 0x44
// QMP6988: absolute air pressure sensor     I2C: 0x70

float qmp_Pressure = 0.0;
float sht30_Temperature = 0.0;
float sht30_Humidity = 0.0;
int n_average = 1;
//String cur = "";
// WiFi network configuration:
#include "WiFi.h"

// WiFi credentials
// const char* ssid = "Misfit";
// const char* password = "12356789";
// const char* ssid = "Amercland";
// const char* password = "yenlam1507";
/* const char* ssid = "ACLAB";
const char* password = "ACLAB2023"; */
const char* ssid = "Sebastian";
const char* password = "khongcopassma";
//const char* ssid = "Ho Van Hiep";
//const char* password = "99999999";
WiFiClient myclient;
WiFiServer server(80);


// GET request types
//#define GET_unknown 0
//#define GET_index_page 1
//#define GET_favicon 2
//#define GET_logo 3
//#define GET_script 4
 
int html_get_request;

#include "index.h"
extern  UNIT_4RELAY relay;

//IPAddress staticIP(192, 168, 1, 15); 
// IPAddress gateway(192, 168, 1, 1);    
// IPAddress subnet(255, 255, 255, 0);   
// IPAddress primaryDNS(192, 168, 1, 1); 
// IPAddress secondaryDNS(0, 0, 0, 0);

//IPAddress staticIP(172, 28, 182, 185); 
//IPAddress gateway(172, 28, 182, 1);
//IPAddress subnet(255, 255, 255, 0);
//IPAddress primaryDNS(172, 28, 182, 1);
//IPAddress secondaryDNS(0, 0, 0, 0);

IPAddress staticIP(192, 168, 137, 190);
IPAddress gateway(192,168,137,248); 
IPAddress subnet(255, 255, 255, 0); 
IPAddress primaryDNS(192,168,137,248);
IPAddress secondaryDNS(0, 0, 0, 0);

void turnRelay(uint8_t relayNum, int state);
bool parseRelayRequest(String request, int &relayNum, int &state);
void publishEnv(String value);
void publishRelay(String value);
void controlRelaysFromString(String);
void relaycontrolfromString(String mess);
void updateWebServerRelaysFromString(const String &message) ;
bool autoRelayRequest(const String& jsonString, const String& httpRequest, int &relayNum, int &state) ;
void publishRelayStates() ;
void I2Cscan();
boolean connect_Wifi();
SHT4X sht4;
BMP280 bmp;
String messRev;
int isMessageReive = 0;
//String cur = "";

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
	subscribeToTopic(MQTT_U_TOPIC_RELAY);


}
void relaycontrolfromString(String mess)
{
	int startIndex1 = mess.indexOf("1") + 3;
	int startIndex2 = mess.indexOf("2") + 3;
	int startIndex3 = mess.indexOf("3") + 3;
	int startIndex4 = mess.indexOf("4") + 3;
	if(mess[startIndex1] == 't')relay.relayWrite(0, 1); 
	else relay.relayWrite(0, 0); 
	if(mess[startIndex2] == 't')relay.relayWrite(1, 1); 
	else relay.relayWrite(1, 0); 
	if(mess[startIndex3] == 't')relay.relayWrite(2, 1); 
	else relay.relayWrite(2, 0); 
	if(mess[startIndex4]== 't')relay.relayWrite(3, 1); 
	else relay.relayWrite(3, 0); 
}
int flatReceive = 0;
void loop() {
	mainTainMqtt();
   // Serial.println(messRev);
	if (messRev != NULL && messRev[2] == 'r') {
		cur = messRev;  
		Serial.println(cur);
	}    
	relaycontrolfromString(cur);
	delay(1000);
	unsigned long current_millis = millis();
	
	if (current_millis >= next_millis) {
		Serial.println("Measure");
		next_millis = current_millis + 1000000;  // Set the next measurement to happen in one hour
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
						} else if (request.startsWith("GET /relay_status")) {
							html_get_request = GET_relay_status;
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
										publishRelayStates();  // Publish to the web server
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
							case GET_relay_status: {
								client.println("HTTP/1.1 200 OK");
								client.println("Content-type:application/json");
								client.println();
	
	
								bool relayStates[4];
								for (int i = 0; i < 4; i++) {
									relayStates[i] = relay.readRelay(i);  // Modify this line based on how your relays are read
								}

								client.printf("{\"relay1\":%s,\"relay2\":%s,\"relay3\":%s,\"relay4\":%s}\n",
				  				relayStates[0] ? "true" : "false",
				  				relayStates[1] ? "true" : "false",
				  				relayStates[2] ? "true" : "false",
				  				relayStates[3] ? "true" : "false");
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
bool autoRelayRequest(const String& jsonString, const String& httpRequest, int &relayNum, int &state) {
	// Initialize relay states to -1, which indicates they are not set
	int relayStates[4] = {-1, -1, -1, -1};

	// Parse the jsonString manually to extract relay states
	int relay1Index = jsonString.indexOf("\"relay1\":");
	int relay2Index = jsonString.indexOf("\"relay2\":");
	int relay3Index = jsonString.indexOf("\"relay3\":");
	int relay4Index = jsonString.indexOf("\"relay4\":");

	if (relay1Index != -1) {
		relayStates[0] = jsonString.substring(relay1Index + 9, relay1Index + 13) == "true" ? 1 : 0;
	}
	if (relay2Index != -1) {
		relayStates[1] = jsonString.substring(relay2Index + 9, relay2Index + 13) == "true" ? 1 : 0;
	}
	if (relay3Index != -1) {
		relayStates[2] = jsonString.substring(relay3Index + 9, relay3Index + 13) == "true" ? 1 : 0;
	}
	if (relay4Index != -1) {
		relayStates[3] = jsonString.substring(relay4Index + 9, relay4Index + 13) == "true" ? 1 : 0;
	}

	// Extract relay number from the HTTP request
	int relayIndex = httpRequest.indexOf("relay=");
	if (relayIndex != -1) {
		relayNum = httpRequest.substring(relayIndex + 6, httpRequest.indexOf('&', relayIndex)).toInt() - 1; // relayNum starts from 0

		// If relay number is valid, assign the corresponding state
		if (relayNum >= 0 && relayNum < 4) {
			state = relayStates[relayNum];
			return true;
		}
	}

	return false; // Return false if parsing fails
}