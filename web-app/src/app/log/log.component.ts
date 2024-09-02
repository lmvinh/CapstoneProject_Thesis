import { Component, OnDestroy, OnInit } from '@angular/core';
import {Chart,registerables} from 'chart.js';
import { SensorDataService,Sensordata } from '../services/sensor-data.service';
import { forkJoin, interval, Subscription } from 'rxjs';
import { RelayStatusService,RelayStatus } from '../services/relay-status.service';
import { DatePipe } from '@angular/common';

Chart.register(...registerables);
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  providers: [DatePipe]
})
export class LogComponent implements OnInit,OnDestroy{
  temperature: number=0;
  humidity: number=0;
  time: string='';
  relayLogs: string[] = [];
  sensorLogs: string[] = [];
  combinedLogs: string[] = [];
  logs: (RelayStatus | Sensordata)[] = [];
  
  private updateSubscription!: Subscription;
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75': {color: 'red'}
};
constructor(private sensorService:SensorDataService,private relayService:RelayStatusService,
   private datePipe: DatePipe){}
  

  ngOnInit(): void {
    //this.renderGauge();
    //this.renderLog();
    this.fetchLogs();
    this.fetchGauge();
    this.updateSubscription = interval(10000).subscribe(() => {
      this.fetchGauge();
    });
  }
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
  fetchGauge(): void {
    this.sensorService.getLastSensorData().subscribe((data) => {
      this.temperature = data.temp;
      this.humidity = data.humi;
      const date=new Date(data.timestamp);
      const formattedDate = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).replace(',', '');
      this.time = `${formattedDate}`;
      

    });
  }
  renderLog() {
    this.relayService.getRelayStatus().subscribe((data) => {
      this.relayLogs = data.map(log => {
        const formattedDate = this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm');
        return `${formattedDate}: relay1:${log.relay1},relay2:${log.relay2},relay3:${log.relay3},relay4:${log.relay4}`;
      });
    });  
    this.sensorService.getSensorData().subscribe((data) => {
      this.sensorLogs = data.map(log => {
        const formattedDate = this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm');
        return `${formattedDate}: temperature:${log.temp}°C,humidity:${log.humi}%`;
      });
    });
  };
  renderLog1() {
    this.relayService.getRelayStatus().subscribe((relayData) => {
      this.sensorService.getSensorData().subscribe((sensorData) => {
        // Combine the relay and sensor data
        const combinedData = [...relayData, ...sensorData].sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

        // Format the combined logs
        this.combinedLogs = combinedData.map(log => {
          const formattedDate = this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm:ss');
          if ('relay1' in log) {
            return `${formattedDate}: relay1:${log.relay1},relay2:${log.relay2},relay3:${log.relay3},relay4:${log.relay4}`;
          } else {
            return `${formattedDate}: temperature:${log.temp}°C,humidity:${log.humi}%`;
          }
        });
      });
    });
  }
  fetchLogs(): void {
    // Fetch both relay-status and sensors data
    this.relayService.getRelayStatus().subscribe((relayData: RelayStatus[]) => {
      this.sensorService.getSensorData().subscribe((sensorData: Sensordata[]) => {
        // Combine both relay and sensor data into a single array
        this.logs = [...relayData, ...sensorData].sort((a, b) => {
          // Sort by timestamp from latest to earliest
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      });
    });
  }
  fetchLogs1(): void {
    // Use forkJoin to run both HTTP requests in parallel
    forkJoin({
      relayData: this.relayService.getRelayStatus(),
      sensorData: this.sensorService.getSensorData()
    }).subscribe(({ relayData, sensorData }) => {
      // Combine both relay and sensor data into a single array
      this.logs = [...relayData, ...sensorData].sort((a, b) => {
        // Sort by timestamp from latest to earliest
        //return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
      });
      
    });
  }
  fetchLogs2(): void {
    // Use forkJoin to run both HTTP requests in parallel
    forkJoin({
      relayData: this.relayService.getRelayStatus(),
      sensorData: this.sensorService.getSensorData()
    }).subscribe(({ relayData, sensorData }) => {
      // Combine both relay and sensor data into a single array
      this.logs = [...relayData, ...sensorData].sort((a, b) => {
        // Sort by timestamp from latest to earliest
        //return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
      });
      
    });
  }
  formatLog(log: RelayStatus|Sensordata): string {
    const date = new Date(log.timestamp);
    const formattedDate = date.toLocaleString('en-GB').replace(/\/(\d)(?=\/)/g, '/0$1').replace(/,/, '');
    
    if ('relay1' in log) {
      return `${formattedDate.slice(0, 16)}: relay1:${log.relay1}, relay2:${log.relay2}, relay3:${log.relay3}, relay4:${log.relay4}`;
    } else {
      return `${formattedDate}: temperature:${log.temp}°C, humidity:${log.humi}%`;
    }
  }
  renderGauge():void
  {
    new Chart('tempGauge', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
