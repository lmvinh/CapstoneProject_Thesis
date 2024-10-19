#include <nbiot.h>   // Include TinyGSM library
UNIT_4RELAY relay;
// Define constants and variables
M5_SIM7080G device;
extern String messRev;
String readstr;
void log(String str) {
	Serial.print(str);

}

void SetupNbiot() {
	device.Init(&Serial2, 19, 22);

	// Reboot the module
	device.sendMsg("AT+CREBOOT\r\n");
	delay(1000);

	// Wait until a valid signal quality is obtained
	while (true) {
		device.sendMsg("AT+CSQ\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);
		if (readstr.indexOf("+CSQ: 99,99") == -1) {
			break;
		}
	}

	// Establish the network connection
	while (true) {
		device.sendMsg("AT+CNACT=0,1\r\n");
		readstr = device.waitMsg(200);
		log(readstr);

		device.sendMsg("AT+CNACT?\r\n");
		readstr = device.waitMsg(200);
		log(readstr);
		
		device.sendMsg("AT+CPIN?\r\n");
		readstr = device.waitMsg(200);
		log(readstr);


		device.sendMsg("AT+CGMM\r\n");
		readstr = device.waitMsg(200);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"URL\",\"mqttserver.tk\",\"1883\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);
		
		device.sendMsg("AT+SMCONF=\"USERNAME\",\"" + String(MQTT_USERNAME) + "\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"PASSWORD\",\"" + String(MQTT_PASSWORD) + "\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);
		
		device.sendMsg("AT+SMCONF=\"KEEPTIME\",60\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"CLEANSS\",1\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"CLIENTID\",\"simmqtt\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONN\r\n");
		readstr = device.waitMsg(5000);
		log(readstr);

		// If connection is successful (no ERROR in the response), exit the loop
		if (readstr.indexOf("ERROR") == -1) {
			break;
		}
	}
}

void mainTainMqtt()
{
	
	readstr = device.waitMsg(0);
	log(readstr);
	int startIndex = readstr.indexOf('{');	
	// Find the ending index of the JSON data
	int endIndex = readstr.lastIndexOf('}') + 1;
	// Extract the JSON substring
	messRev = readstr.substring(startIndex, endIndex);
		  // Extract relay states manually
}

void subscribeToTopic(String topic) {
	device.sendMsg("AT+SMSUB=\"" + topic + "\",1\r\n");
	readstr = device.waitMsg(1000);
	log(readstr);
	Serial.println("subcribed");

}



void publishRelay(String payload) {
	device.sendMsg("AT+SMPUB=\"/innovation/airmonitoring/WSNs/ABC/relay\","+ String(payload.length()) +",1,1\r\n");
	delay(1000);  // Wait for publish to complete
	device.sendMsg(payload);

}

void publishEnv(String payload) {
	device.sendMsg("AT+SMPUB=\"/innovation/airmonitoring/WSNs/ABC/env\","+ String(payload.length()) +",1,1\r\n");
	delay(1000);  // Wait for publish to complete
	device.sendMsg(payload);
}
