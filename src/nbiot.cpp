#include <nbiot.h>   // Include TinyGSM library

// Define constants and variables
M5_SIM7080G device;

String readstr;
void log(String str) {
	Serial.print(str);

}

void SetupNbiot()
{
	 device.Init(&Serial2, ATOM_DTU_SIM7080_RX, ATOM_DTU_SIM7080_TX);
	device.sendMsg("AT+CREBOOT\r\n");
	delay(1000);
	while(1){
		device.sendMsg("AT+CSQ\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);
		if(readstr.indexOf("+CSQ: 99,99") ==-1){
			break;
		}
	}
}
void mainTainMqtt()
{
	 while(1) {
		device.sendMsg("AT+CNACT=0,1\r\n");
		readstr = device.waitMsg(200);
		log(readstr);

		device.sendMsg("AT+CNACT?\r\n");
		readstr = device.waitMsg(200);
		log(readstr);

	device.sendMsg("AT+SMCONF=\"URL\",\"" + String(MQTT_SERVER) + "\"," + String(MQTT_PORT) + "\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"KEEPTIME\",60\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"CLEANSS\",1\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONF=\"USERNAME\",\"" + String(MQTT_USERNAME) + "\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);
		
		device.sendMsg("AT+SMCONF=\"PASSWORD\",\"" + String(MQTT_PASSWORD) + "\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);
		
		device.sendMsg("AT+SMCONF=\"CLIENTID\",\"simmqtt\"\r\n");
		readstr = device.waitMsg(1000);
		log(readstr);

		device.sendMsg("AT+SMCONN\r\n");
		readstr = device.waitMsg(5000);
		log(readstr);

		if(readstr.indexOf("ERROR") == -1) {
			break;
		}
	}
}
void publishRelay(String payload)
{           
	device.sendMsg("AT+SMPUB=\""+String(MQTT_U_TOPIC_RELAY)+"\","+payload+",1,1\r\n");
	delay(100);
}
void publishEnv(String payload)
{           
	device.sendMsg("AT+SMPUB=\""+String(MQTT_U_TOPIC_ENV)+"\","+payload+",1,1\r\n");
	delay(100);
}