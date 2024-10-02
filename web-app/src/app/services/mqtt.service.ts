import { Injectable } from '@angular/core';

import  mqtt from "mqtt" ;
import { SensorDataService } from './sensor-data.service';
import { RelayStatusService } from './relay-status.service';

@Injectable({
  providedIn: 'root'
})
export class MQTTHiveMQService {
  private MQTTclient:mqtt.MqttClient;
  /* private host='wss://250b3bef1ac048d9bc134e6f8a995753.s1.eu.hivemq.cloud:8884/mqtt';
  private options={
    username:'data-value',
    password:'123456Abc',
  }; */
  /* private host='wss://wdf90d3f.ala.us-east-1.emqxsl.com/mqtt';
  private options={
    username:'client3',
    password:'client3',
  }; */
  private options: mqtt.IClientOptions={    
    host:'mqttserver.tk',
    port:9001,
    protocol:'ws',
    username:'innovation',
    password:'Innovation_RgPQAZoA5N', 
  }; 
 
   //topic is sensor topic data
   //topic1 is relaytopic data
  private topic2='relay';
  private topic4='data';
  private topic='/innovation/airmonitoring/WSNs/ABC/env';
  private topic1='/innovation/airmonitoring/WSNs/ABC/relay';
  private topic3='testtopic/1';
  constructor(private sensorService:SensorDataService,private relayService:RelayStatusService)
  {
     
    //this.MQTTclient=mqtt.connect(this.host,this.options);
    this.MQTTclient=mqtt.connect(this.options);
    this.MQTTclient.on('error', (err) => {
      console.error('Connection error: ', err);
      this.MQTTclient.end();
    }); 

    
    this.MQTTclient.on('connect', () => {
      console.log('Connected to MQTT server');

      this.MQTTclient.subscribe(this.topic,(err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else 
        {
          console.log('Subscribed to sensor topic ');        
        }
      });
    });
    this.MQTTclient.on('connect', () => {
      console.log('Connected to MQTT server');

      this.MQTTclient.subscribe(this.topic1,(err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else 
        {
          console.log('Subscribed to relay topic ');        
        }
      });
    });

    this.MQTTclient.on('message',(topic, message) => {
      const data = JSON.parse(message.toString());
      if (topic===this.topic){
      //this.sensorService.saveSensorData(data).subscribe();  //when topic a public do this method 
      this.sensorService.saveSensorData(data);
      console.log(data);
      }
    else if (topic===this.topic1)
    {
      //this.relayService.saveRelaystate(data).subscribe();     //when topic b public do this method
      this.relayService.saveRelaystate(data);
      console.log(data);
    }
    });
  }



  

  publicMessage(message:object):void{
    const payload = JSON.stringify(message);
    this.MQTTclient.publish(this.topic1, payload, (err) => {
      if (err) {
        console.error('Publish error: ', err);
      } else {
        console.log('Message published: ', payload);
      }
    });
  }
  publictest(){
    this.MQTTclient.publish(this.topic,"hello");

  }

  subscribeToTopic(): void {
    this.MQTTclient.subscribe(this.topic1, (err) => {
      if (err) {
        console.error('Subscription error: ', err);
      } else {
        console.log('Subscribed to topic: ', this.topic);
      }
    });
  }

  onMessage(callback: (topic: string, message: Buffer) => void): void {
    this.MQTTclient.on('message', (topic, message) => {
      callback(topic, message);
    });
  }

  disconnect(): void {
    this.MQTTclient.end();
  }
}
