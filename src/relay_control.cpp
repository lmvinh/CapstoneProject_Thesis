#include "relay_control.h"
extern UNIT_4RELAY relay;

void relayControlSetup() {
    Wire.begin(25, 21);
    relay.begin(&Wire, 25, 21);
    relay.Init(1);
    relay.relayAll(0);
	Serial.println("Relay step");

}
int mode = 0;int flag = 0;
void ControlRelayManualByButton()
{ 
	// Button A press: Increment mode
	if (buttonAisPress()) {
		mode++;
		if (mode > 5) mode = 0;  // Reset mode if it exceeds the max case (optional)	
		M5.dis.fillpix(0x001100); // Display green for feedback
		delay(100);               // Brief delay for visual feedback
		M5.dis.clear();
		Serial.println(mode);
	}

	// Button B press: Set flag to current mode and reset mode to 0
	if (buttonBisPress()) {
		flag = mode;
		mode = 0;
		M5.dis.fillpix(0x001100); // Display green for feedback
		delay(100);               // Brief delay for visual feedback
		M5.dis.clear();
		Serial.println(flag);
		
	}
	bool relayStates[4];  // Array to hold the state of each relay
	// Retrieve the current state of each relay
	for (int i = 0; i < 4; i++) {
		relayStates[i] = relay.readRelay(i);  // Replace with actual relay state reading
	}

	// Control relays based on the flag value
	switch (flag) {
		case 0:
			relay.relayAll(0);  // Turn off all relays
			flag = -1;
			publishRelayStates();
			break;
		case 1:
			relay.relayWrite(0, !relayStates[0]);  // Toggle relay 0
			flag = -1;
			publishRelayStates();
			break;
		case 2:
			relay.relayWrite(1, !relayStates[1]);  // Toggle relay 1
			flag = -1;
			publishRelayStates();
			break;
		case 3:
			relay.relayWrite(2, !relayStates[2]);  // Toggle relay 2
			flag = -1;
			publishRelayStates();
			break;
		case 4:
			relay.relayWrite(3, !relayStates[3]);  // Toggle relay 3
			flag = -1;
			publishRelayStates();
			break;
		case 5:
			relay.relayAll(1);  // Turn on all relays
			flag = -1;
			publishRelayStates();
			break;
		default:
			break;
	}
}
void relaycontrolfromString(const String& mess) {    
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



void publishRelayStates() {
    // Publish the current state of relays
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
void i2cScan() {
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