/* #include "testmain.h"

void setup() {
    M5.begin(true, false, true);
    //Serial.begin(115200);

    // Ini the relay, sensors, and other 
    relayControlSetup();
    sensorSetup();
    subscribeToTopic(MQTT_U_TOPIC_RELAY);
    i2cScan();

    M5.dis.fillpix(LED_ERROR);
    Serial.println("M5ATOM ENV monitor");
	Serial.println("v1.0 | 26.11.2021");
    // Start WiFi connection
    wifiSetup();
    // Start nhubuiIOT
    SetupNbiot();

    // Start the server
    server.begin();

    // Start the tasks
    
    Serial.println("Setup complete");
    xTaskCreate(envMeasureTask, "", 4096, NULL, 1, NULL);
    xTaskCreate(pubsubTask, "", 4096, NULL, 1, NULL);
}

void loop() {
   
} */