import mqtt from 'mqtt';


const MQTT_SERVER = "mqtt://mqttserver.tk";
const MQTT_PORT = 9001;
const MQTT_USERNAME = "innovation";
const MQTT_PASSWORD = "Innovation_RgPQAZoA5N";
const MQTT_TOPIC_SUBSCRIBE = "/innovation/airmonitoring/WSNs/ABC";

// Create MQTT client instance
const client = mqtt.connect(MQTT_SERVER, {
    port: MQTT_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
});

// Handle MQTT events
client.on('connect', function () {
    console.log('Connected to MQTT server');
    client.subscribe(MQTT_TOPIC_SUBSCRIBE, function (err) {
        if (!err) {
            console.log('Subscribed to topic:', MQTT_TOPIC_SUBSCRIBE);
        }
    });
});

client.on('message', function (topic, message) {
    console.log('Received message:', message.toString());
});

client.on('error', function (error) {
    console.error('Error:', error);
});

// Publish example message
client.publish(MQTT_TOPIC_SUBSCRIBE, '1');

// Optionally disconnect MQTT client
// client.end();
export default client
