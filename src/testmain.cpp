/* #include "testmain.h"

void setup() {
    M5.begin(true, false, true);
    Serial.begin(115200);

    // Initialize the relay, sensors, and other components
    relayControlSetup();
    sensorSetup();
    subscribeToTopic(MQTT_U_TOPIC_RELAY);
    i2cScan();

    // Start WiFi connection
    wifiSetup();

   

    // Start the server
    server.begin();

    // Start the tasks
    
    Serial.println("Setup complete.");
    xTaskCreate(envMeasureTask, "", 4096, NULL, 1, NULL);
    xTaskCreate(pubsubTask, "", 4096, NULL, 1, NULL);
}

void loop() {
   
} */