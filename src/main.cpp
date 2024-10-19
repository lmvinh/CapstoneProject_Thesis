#include "main.h"
/*
unsigned long next_millis1;
SHT4X sht41;
BMP280 bmp1;
extern  UNIT_4RELAY relay; */
void setup() {
    /*Compare working flow
    M5.begin(true, false, true);
	Wire.begin(25, 21);         
	relay.begin(&Wire, 25, 21);
	relay.Init(1);
	delay(50); 
	M5.dis.fillpix(LED_ERROR); 
	Serial.println("M5ATOM ENV monitor");
	Serial.println("v1.0 | 26.11.2021");
	relay.relayAll(0);
	i2cScan();
	WiFi.mode(WIFI_STA);
	WiFi.disconnect();
	delay(1000);	
	SetupNbiot();

	server.begin();     
	if (!sht41.begin(&Wire, SHT40_I2C_ADDR_44, 25, 21, 400000U)) {
		Serial.println("Couldn't find SHT4x");
		while (1) delay(1);
	}
	
	sht41.setPrecision(SHT4X_HIGH_PRECISION);
	sht41.setHeater(SHT4X_NO_HEATER);

	if (!bmp1.begin(&Wire, BMP280_I2C_ADDR, 25, 21, 400000U)) {
		Serial.println("Couldn't find BMP280");
		while (1) delay(1);
	}
	
	bmp1.setSampling(BMP280::MODE_NORMAL, 
					BMP280::SAMPLING_X2,     
					BMP280::SAMPLING_X16,    
					BMP280::FILTER_X16,      
					BMP280::STANDBY_MS_500); 
	next_millis1 = millis() + 5000;
	subscribeToTopic(MQTT_U_TOPIC_RELAY); */

    //**************************************

    M5.begin(true, false, true);
    //Serial.begin(115200);

    // Init the relay, sensors, and other 
    relayControlSetup();
	i2cScan();
    sensorSetup();
    
    

    M5.dis.fillpix(LED_ERROR);
    Serial.println("M5ATOM ENV monitor");
	Serial.println("v1.0 | 26.11.2021");
    // Start WiFi connection
    wifiSetup();
    // Start nhubuiIOT
    SetupNbiot();
	Serial.println("Setup complete");
	subscribeToTopic(MQTT_U_TOPIC_RELAY);
    // Start the server
    //server.begin();
	
    // Start the tasks
    
    
    xTaskCreate(envMeasureTask, "", 4096, NULL, 1, NULL);
    xTaskCreate(pubsubTask, "", 4096, NULL, 1, NULL);
}

void loop() {
   
}
