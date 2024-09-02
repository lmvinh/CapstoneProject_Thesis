import { Injectable } from '@angular/core';
import mqtt,{ MqttClient } from 'mqtt';
@Injectable({
  providedIn: 'root'
})
export class MQTTTBrokerService {

  constructor() { }
  private client: MqttClient| null = null;

  connect(host: string, port: number, clientId: string, username?: string, password?: string): void {
    const url = `wss://${host}:${port}/mqtt`;
    const options = {
      clientId: clientId,
      username: username,
      password: password,
      
    };
    this.client = mqtt.connect(url, options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('Connection error:', err);
      this.client?.end();
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
    }
  }

  subscribe(topic: string, callback: (message: string) => void): void {
    if (this.client) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${topic}:`, err);
          return;
        }
        console.log(`Subscribed to topic: ${topic}`);
      });

      this.client.on('message', (receivedTopic, payload) => {
        if (receivedTopic === topic) {
          callback(payload.toString());
        }
      });
    }
  }

  publish(topic: string, message: string): void {
    if (this.client) {
      this.client.publish(topic, message, {}, (err) => {
        if (err) {
          console.error(`Failed to publish to topic ${topic}:`, err);
        } else {
          console.log(`Message published to topic: ${topic}`);
        }
      });
    }
  }
}
