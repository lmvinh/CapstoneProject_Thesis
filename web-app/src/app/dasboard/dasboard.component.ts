import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdafruitIoService } from '../services/adafruit-io.service';
import { MQTTHiveMQService } from '../services/mqtt.service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent implements OnInit  {
  //switch1 : boolean=true;
  //switch2 : boolean=true;
  //switch3 : boolean=true;
  //switch4 : boolean=true;
  //sensor1: number=0;
  //sensor2: number=0;
  constructor(private adafruitService: AdafruitIoService) {}
  ngOnInit() {
    //this.adafruitService.getFeedValue('sw1').subscribe(data => this.switch1 = data.value === 'ON');
    //this.getFeedData();
    //setInterval(()=>this.getFeedData(),1000);
  }

  /* getFeedData() 
  {
    this.adafruitService.getFeedValue('sw1').subscribe(data=>{
      this.switch1=data[0].value==='1'
    });
    this.adafruitService.getFeedValue('sw2').subscribe(data=>{
      this.switch2=data[0].value==='1'
    });
    this.adafruitService.getFeedValue('sw3').subscribe(data=>{
      this.switch3=data[0].value==='1'
    });
    this.adafruitService.getFeedValue('sw4').subscribe(data=>{
      this.switch4=data[0].value==='1'
    });
    this.adafruitService.getFeedValue('sensor1').subscribe(data=>{
      this.sensor1=+data[0].value
    });
    this.adafruitService.getFeedValue('sensor2').subscribe(data=>{
      this.sensor2=+data[0].value
    }); */

    
    
    
  }
  /* toggleSwitch1(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw1', this.switch1 ? '1' : '0').subscribe();    
  }
  toggleSwitch2(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw2', this.switch2 ? '1' : '0').subscribe();    
  }
  toggleSwitch3(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw3', this.switch3 ? '1' : '0').subscribe();    
  }
  toggleSwitch4(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw4', this.switch4 ? '1' : '0').subscribe();    
  } */
  

