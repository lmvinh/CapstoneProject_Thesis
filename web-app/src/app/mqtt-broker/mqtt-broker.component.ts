import { Component } from '@angular/core';
import { MQTTTBrokerService } from '../services/mqttBrokerservice';

@Component({
  selector: 'app-mqtt-broker',
  templateUrl: './mqtt-broker.component.html',
  styleUrls: ['./mqtt-broker.component.css']
})
export class MqttBrokerComponent {
  clientId = '';
  username = '';
  password = '';
  topic = '';
  pubTopic = '';
  pubMessage = '';
  messages: string[] = [];
  isConnected = false;

  constructor(private brokerService: MQTTTBrokerService) {}

  connect() {
    const host = 'wdf90d3f.ala.us-east-1.emqxsl.com';
    const port = 8084;
    this.brokerService.connect(host, port, this.clientId, this.username, this.password);
    this.isConnected = true;
  }

  subscribe() {
    this.brokerService.subscribe(this.topic, (message: string) => {
      this.messages.push(message);
    });
  }

  publish() {
    this.brokerService.publish(this.pubTopic, this.pubMessage);
  }
}
