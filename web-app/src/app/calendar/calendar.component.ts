import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { interval, Subscription } from 'rxjs';
import 'chartjs-adapter-moment'
import { SensorDataService } from '../services/sensor-data.service';
Chart.register(...registerables);
interface SensorData {
  id: number;
  temp: number;
  humi: number;
  air:number;
  timestamp: string;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit,OnDestroy{
  combineChart!: Chart;
  selectedDate: Date=new Date();
  private updateSubscription!: Subscription;
  ngOnInit(): void {
    this.fetchDataAndCreateCharts();
           
    this.updateSubscription = interval(10000).subscribe(() => {
      this.fetchDataAndUpdateCharts();
      
    });   
  }
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
  constructor(private sensorservice:SensorDataService){}

  filterDataByDate(data: SensorData[], selectedDate: Date): SensorData[] {
    return data.filter(sensor => {
      const date = new Date(sensor.timestamp);
      return date.toDateString() === selectedDate.toDateString();
    });
  }

  fetchDataAndCreateCharts(): void {
       
    this.sensorservice.getSensorData().subscribe((data: SensorData[]) => {
      const filteredData = this.filterDataByDate(data, this.selectedDate);
      /* const times = filteredData.map(sensor => {
        const date = new Date(sensor.timestamp);
        return date.toLocaleTimeString();
      }); */
      const times = filteredData.map(sensor => new Date(sensor.timestamp));
      const temps = filteredData.map(sensor => sensor.temp);
      const humis = filteredData.map(sensor => sensor.humi);
      const airs = filteredData.map(sensor => sensor.air);
      const formatted=formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
      this.combineChart=this.createChart1('ttt',times,temps,humis,airs,`Day ${formatted}`);
            
    });
}
createChart1(chartId: string, labels: Date[], data1: number[],
  data2: number[],data3: number[],
  title:string): Chart {
  return new Chart(chartId, {
    type: 'line',
    data: {
      //labels: labels.length ? labels : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`],
      //labels: labels.map(date => date.toISOString()),
      labels: labels.length ? labels.map(date => date.toISOString()) : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`],
      //labels:labels.map(date => date.toLocaleTimeString()),
      datasets: [
        {
          label:  'Temperature' ,
          data: labels.length ? data1 : [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y',
          tension:0.4,
          pointStyle: 'rectRounded',
          pointRadius: 15,
          pointHoverRadius: 25
        },
        {
          label:  'Humidity' ,
          data: labels.length ? data2 : [],
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          yAxisID: 'y1',
          tension:0.4,
          pointStyle: 'triangle',
          pointRadius: 15,
          pointHoverRadius: 25
        },
        {
          label:  'Air quality' ,
          data: labels.length ? data3 : [],
          backgroundColor: 'rgba(202, 204, 33, 0.8)',
          borderColor: 'rgba(186, 188, 13, 0.8)',
          borderWidth: 1,
          yAxisID: 'y2',
          tension:0.4,
          pointStyle: 'star',
          pointRadius: 15,
          pointHoverRadius: 25
        }
      ],
    },
    options: {
      responsive:false,
      maintainAspectRatio:false,
      scales: {
        x:{           
          grid:{
            display:false
          },
          type: 'time',
          time: {
            unit: 'hour',  
            tooltipFormat: 'HH:mm', 
            displayFormats:{
              hour:'H[h]'
            }
          },
          
        },               
        
        y: {
          grid:{
          display:false
        },
          beginAtZero: true,
          title:{
            display:true,
            text:'Value '
          },
          position:'left'
        },
        y1:{
          display:false,
          grid:{
            display:false
          },
          beginAtZero: true,
          title:{
            display:false,
            text:'Humidity (%)'
          },
          
        },
        y2:{
          grid:{
            display:false
          },
          beginAtZero: false,
          title:{
            display:true,
            text:'Air Quality(PPM)'
          },
          position:'right'
        }
        
      },
      plugins:{          
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (context.dataset.yAxisID === 'y') {
                  label += `${context.parsed.y}°C`; // Temperature format
                } else if (context.dataset.yAxisID === 'y1') {
                  label += `${context.parsed.y}%`; // Humidity format
                }
                else if (context.dataset.yAxisID === 'y2') {
                  label += `${context.parsed.y}PPM`; // Air format
                }
              }
              return label;
            }
          },
          mode:'index',
          intersect:false
        },
        title:{
          display:true,
          text:labels.length ?title:title+" don't have data"
        }
      }
    },
    
  });
}
fetchDataAndUpdateCharts(): void {
         
  this.sensorservice.getSensorData().subscribe((data: SensorData[]) => {
    const filteredData = this.filterDataByDate(data, this.selectedDate);
    /* const times = filteredData.map(sensor => {
      const date = new Date(sensor.timestamp);
      return date.toLocaleTimeString();
    }); */
    const times = filteredData.map(sensor => new Date(sensor.timestamp));
    const temps = filteredData.map(sensor => sensor.temp);
    const humis = filteredData.map(sensor => sensor.humi);
    const airs  = filteredData.map(sensor => sensor.air);
    const formatted=formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
    this.updateChart1(this.combineChart,`Day ${formatted}`,times,temps,humis,airs)
    
  });
  
}
updateChart1(chart: Chart,title: string,  labels: Date[], data1: number[],
  data2: number[],data3: number[]): void {
  //chart.data.labels = labels.length ? labels.map(date => date.toLocaleTimeString()) : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`];
  //chart.data.labels = labels.length ? labels : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`];
  chart.data.labels =labels;
  chart.data.datasets[0].data = labels.length ? data1 : [];
  chart.data.datasets[1].data = labels.length ? data2 : [];
  chart.data.datasets[2].data = labels.length ? data3 : [];
  if (chart.options?.plugins?.title) {
    chart.options.plugins.title.text = labels.length?title:title+" don't have data";
  } else {      
    /* chart.options = chart.options || {};
    chart.options.plugins = chart.options.plugins || {};
    chart.options.plugins.title = chart.options.plugins.title || { text: title }; */
    chart.options.plugins = {
      ...chart.options.plugins,
      title: {
          display: true,
          text: title
      }
  };
  }
  chart.update();
}
}
