import { Component, OnDestroy, OnInit } from '@angular/core';
import { SensorDataService } from '../services/sensor-data.service';
import { Chart, registerables } from 'chart.js';
import { interval, Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'chartjs-adapter-moment'
Chart.register(...registerables);
const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DDMMYYYY',
  },
  display: {
    dateInput: 'DDMMYYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
interface SensorData {
  id: number;
  temp: number;
  humi: number;
  air:number;
  timestamp: string;
}
@Component({
  selector: 'app-humi-chart',
  templateUrl: './humi-chart.component.html',
  styleUrls: ['./humi-chart.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})
export class HumiChartComponent implements OnInit,OnDestroy {
  
  private updateSubscription!: Subscription;
  humiChart!: Chart;
  tempChart!: Chart;
  
  combineChart!: Chart;
  selectedDate: Date=new Date();

  selectedPeriod: string = 'Day';
  tempAverage: number = 0;
  humiAverage: number = 0;
  airAverage:number=0;
  
  constructor(private sensorservice:SensorDataService,private http:HttpClient){}
 
  //init
  ngOnInit(): void { 
    //this.fetchDataAndCreateCharts();
    this.fetchAndCreatChart();
    this.fetchDataAve();       
    this.updateSubscription = interval(10000).subscribe(() => {
      //this.fetchDataAndUpdateCharts();
      this.fetchDataAve();
      this.fetchAndUpdateChart();
    });   
    
  }
  //end init
  fetchDataAve(): void {
    let fetchObservable: Observable<SensorData[]>;

    if (this.selectedPeriod === 'Day') {
      //fetchObservable = this.sensorservice.getSensorsForDay(this.selectedDate || new Date());
      fetchObservable = this.sensorservice.getSensorsForDay( new Date());
    } else if (this.selectedPeriod === 'Week') {
      fetchObservable = this.sensorservice.getSensorsForLastNDays(2);
    } else if (this.selectedPeriod === 'Month') {
      fetchObservable = this.sensorservice.getSensorsForLastNDays(3);
    } else {
      console.error('Unexpected period selected');
      return;
    }
    fetchObservable.subscribe((data) => {
      this.calculateAverages(data);
    });
  }

  calculateAverages(data: SensorData[]): void {
    if (data.length === 0) {
      this.tempAverage = 0;
      this.humiAverage = 0;
      this.airAverage=0;
    } else {
      const tempSum = data.reduce((sum, sensor) => sum + sensor.temp, 0);
      const humiSum = data.reduce((sum, sensor) => sum + sensor.humi, 0);
      const airSum = data.reduce((sum, sensor) => sum + sensor.air, 0);
      this.tempAverage = tempSum / data.length;
      this.humiAverage = humiSum / data.length;
      this.airAverage = airSum / data.length;
    }
  }
  onTogglePeriod(): void {
    this.fetchDataAve();
    this.fetchAndUpdateChart();
  }
  
  
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.combineChart) {
      this.combineChart.destroy(); // Destroy the chart instance when the component is destroyed
    }
  }
  filterDataByDate(data: SensorData[], selectedDate: Date): SensorData[] {
    return data.filter(sensor => {
      const date = new Date(sensor.timestamp);
      return date.toDateString() === selectedDate.toDateString();
    });
  }
  filterDataByPeriod(): Observable<SensorData[]> {
    if (this.selectedPeriod === 'Day') {
      return this.sensorservice.getSensorsForDay(new Date());
    } else if (this.selectedPeriod === 'Week') {
      return this.sensorservice.getSensorsForLastNDays(2);
    } else if (this.selectedPeriod === 'Month') {
      return this.sensorservice.getSensorsForLastNDays(3);
    }
    return this.sensorservice.getSensorData(); // default return if none of the periods match
  }
  fetchAndCreatChart():void
  {
    this.filterDataByPeriod().subscribe((data: SensorData[]) => {
      /* if (this.combineChart) {  
        this.combineChart.destroy();
      } */
      const times = data.map(sensor => new Date(sensor.timestamp));
      const temps = data.map(sensor => sensor.temp);
      const humis = data.map(sensor => sensor.humi);
      const airs  = data.map(sensor => sensor.air);
      const formatted=formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
      const title=`Day ${formatted} ttt`; 
        this.combineChart=this.createChart2('tttt',times,temps,humis,airs,title);
    });
  }
  fetchAndUpdateChart():void{
    this.filterDataByPeriod().subscribe((data: SensorData[]) => {
      /* if (!this.combineChart) {
        this.fetchAndCreatChart();
        return;
      } */
      const times = data.map(sensor => new Date(sensor.timestamp));
      const temps = data.map(sensor => sensor.temp);
      const humis = data.map(sensor => sensor.humi);
      const airs  = data.map(sensor => sensor.air);
      const formatted=formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
      let title=`Day ${formatted} `; 
      if (this.selectedPeriod === 'Week')
        title='Last 2 day';
      else if(this.selectedPeriod === 'Month')
        title='Last 3 day';
      this.updateChart1(this.combineChart,title,times,temps,humis,airs);
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
        const formatted=formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
        this.combineChart=this.createChart1('ttt',times,temps,humis,`Day ${formatted}`);
        this.tempChart = this.createChart('tempChart', 
          `Temperature `, 
          times, temps,'°C',`Day ${formatted}`, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');

        this.humiChart = this.createChart('humiChart', 
          `Humidity `, 
          times, humis,'%',`Day ${formatted}`, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');

        
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
      const formatted=formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');      
      //this.updateChart1(this.combineChart,`Day ${formatted}`,times,temps,humis)
      this.updateChart(this.tempChart,`Day ${formatted}`, times, temps);
      this.updateChart(this.humiChart,`Day ${formatted}`, times, humis);
    });
    this.fetchDataAve();
  }
   
  createChart(chartId: string, label: string, labels: Date[], data: number[],
    unit: string,title:string, bgColor: string, borderColor: string): Chart {
    return new Chart(chartId, {
      type: 'line',
      data: {
        //labels: labels.length ? labels : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`],
        //labels: labels.map(date => date.toISOString()),
        labels: labels.length ? labels.map(date => date.toISOString()) : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`],
        //labels:labels.map(date => date.toLocaleTimeString()),
        datasets: [
          {
            label:  label ,
            data: labels.length ? data : [],
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive:false,
        maintainAspectRatio:false,
        scales: {
          x:{           
            type: 'time',
            time: {
              unit: 'hour',  
              tooltipFormat: 'HH:mm', 
            },
          },               
          
          y: {
            beginAtZero: true,
            title:{
              display:true,
              text:unit
            }
          }
          
        },
        plugins:{
          tooltip:{
            callbacks:{
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}${unit}`;
              }
            }
          },
          title:{
            display:true,
            text:labels.length ?title:title+" don't have data"
          }
        }
      },
      
    });
  }
  createChart1(chartId: string, labels: Date[], data1: number[],
    data2: number[],
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
            tension:0.4
          },
          {
            label:  'Humidity' ,
            data: labels.length ? data2 : [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
            tension:0.4
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
              text:'Temperature (°C)'
            },
            position:'left'
          },
          y1:{
            grid:{
              display:false
            },
            beginAtZero: true,
            title:{
              display:true,
              text:'Humidity (%)'
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
                }
                return label;
              }
            }
          },
          title:{
            display:true,
            text:labels.length ?title:title+" don't have data"
          }
        }
      },
      
    });
  }
  createChart2(chartId: string, labels: Date[], data1: number[],
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
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
              text:'Value'
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
                  } else if (context.dataset.yAxisID === 'y2') {
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
  updateChart10(chart: Chart, labels: string[], data: number[]): void {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }
  updateChart(chart: Chart,title: string,  labels: Date[], data: number[]): void {
    //chart.data.labels = labels.length ? labels.map(date => date.toLocaleTimeString()) : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`];
    //chart.data.labels = labels.length ? labels : [`Day ${formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US')} don't have data`];
    chart.data.labels =labels;
    chart.data.datasets[0].data = labels.length ? data : [];
    
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
  updateChart1(chart: Chart,title: string,  labels: Date[], 
    data1: number[],data2: number[],data3: number[]): void {
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
