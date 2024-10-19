#include "task.h"

unsigned long next_millis;
WiFiServer server(80);
float qmp_Pressure = 0.0;
float sht30_Temperature = 0.0;
float sht30_Humidity = 0.0;
int n_average = 1;
extern  UNIT_4RELAY relay;
int html_get_request;
SHT4X sht4;
BMP280 bmp;
String messRev;
String cur = "1";

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
void envMeasureTask(void* pvParameters) 
{
    while(1)
	{
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
	Serial.println("measure task");
	vTaskDelay(3600);
	}
}
void pubsubTask (void* pvParameters)
{
	while(1)
	{
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
}