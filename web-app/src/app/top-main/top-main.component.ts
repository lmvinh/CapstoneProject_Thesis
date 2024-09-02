import { Component, OnInit } from '@angular/core';
import { AdafruitIoService } from '../services/adafruit-io.service';
import { RelayStatusService } from '../services/relay-status.service';
import { MQTTHiveMQService } from '../services/mqtt.service';

@Component({
  selector: 'app-top-main',
  templateUrl: './top-main.component.html',
  styleUrls: ['./top-main.component.css']
})
export class TopMainComponent  implements OnInit{
  switch1 : boolean=true;
  switch2 : boolean=true;
  switch3 : boolean=true;
  switch4 : boolean=true;
  constructor(private adafruitService: AdafruitIoService,private relay_stateService:RelayStatusService,
    private mqttService:MQTTHiveMQService  ) {}
  ngOnInit(): void {
      //this.getFeedData();
      this.fetchStatus();
      //setInterval(()=>this.getFeedData(),1000);
      setInterval(()=>this.fetchStatus(),1000);
      //this.mqttService.subscribeToTopic();
      
  }
  
  getFeedData() 
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
  }
  fetchStatus()
  {
    this.relay_stateService.getLastStatus().subscribe((status)=>{
      this.switch1=status.relay1;
      this.switch2=status.relay2;
      this.switch3=status.relay3;
      this.switch4=status.relay4;
    })
  }
  handleRelayData():void{
    const message={ 
      relay1:this.switch1,
      relay2:this.switch2,
      relay3:this.switch3,
      relay4:this.switch4
    } ;
    this.mqttService.publicMessage(message);
    //this.mqttService.publictest();
    this.relay_stateService.saveRelaystate(message).subscribe();
  }
  toggleSwitch1(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw1', this.switch1 ? '1' : '0').subscribe();  
    this.handleRelayData(); 
    
  }
  toggleSwitch2(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw2', this.switch2 ? '1' : '0').subscribe(); 
    this.handleRelayData();   
  }
  toggleSwitch3(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw3', this.switch3 ? '1' : '0').subscribe();
    this.handleRelayData();    
  }
  toggleSwitch4(): void {
    //this.switch1 = !this.switch1;
    this.adafruitService.sendFeedValue('sw4', this.switch4 ? '1' : '0').subscribe();    
    this.handleRelayData();
  }

}
