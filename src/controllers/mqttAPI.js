
import mqtt from "mqtt";
const MAIN_TOPIC = "/innovation/airmonitoring/WSNs/ABC/";


class MQTTHelper {
    constructor() {
        this.MQTT_SERVER = "http://mqtt.lpnserver.net/";
        this.MQTT_PORT = 9001;
        this.MQTT_USERNAME = "innovation";
        this.MQTT_PASSWORD = "Innovation_RgPQAZoA5N";

        this.MQTT_TOPIC_SUB_AIR = MAIN_TOPIC ;
        
        this.recvCallBack = null;

        // Create MQTT client
        this.mqttClient = mqtt.connect(this.MQTT_SERVER, {
            port: this.MQTT_PORT,
            username: this.MQTT_USERNAME,
            password: this.MQTT_PASSWORD
        });

        // Register MQTT events
        this.mqttClient.on('connect', this.mqtt_connected.bind(this));
        this.mqttClient.on('message', this.mqtt_recv_message.bind(this));
        this.mqttClient.on('subscribe', this.mqtt_subscribed.bind(this));
    }

    mqtt_connected() {
        console.log("Connected successfully!!");
        this.mqttClient.subscribe(this.MQTT_TOPIC_SUB_AIR, (err) => {
            if (!err) {
                console.log("Subscribed to Topic!!!");
            } else {
                console.log("Subscription error:", err);
            }
        });
    }

    mqtt_subscribed() {
        console.log("Subscribed to Topic!!!");
    }

    mqtt_recv_message(topic, message) {
        console.log("Received:", message.toString());
        if (this.recvCallBack) {
            this.recvCallBack(message.toString());
        }
    }

    setRecvCallBack(func) {
        this.recvCallBack = func;
    }

    publish(topic, message) {
        this.mqttClient.publish(topic, String(message), { retain: true });
    }
}

// Example usage
// function exampleCallback(message) {
//     console.log("Callback received message:", message);
// }

// // Initialize the MQTT helper
// const mqttHelper = new MQTTHelper();

// // Set the receive callback
// mqttHelper.setRecvCallBack(exampleCallback);
// Publish a message to a specific topic
export default MQTTHelper;