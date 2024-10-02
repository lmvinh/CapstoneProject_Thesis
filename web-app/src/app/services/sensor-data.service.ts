import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';

export interface Sensordata
{
  id: number;
  temp: number;
  humi: number;
  air:number;
  timestamp: string;
}
@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  //private apiURL= 'http://localhost:3000/sensors';
  //private apiURL= 'http://10.0.112.139:3000/sensors';
  //private apiURL= 'http://192.168.192.183:3000/sensors';
  //private apiURL= 'assets/db3.json';
  //private apiURL= 'http://172.28.182.157:3000/sensors';

  private sensorDataRef = this.db.list<Sensordata>('sensors');
  constructor(private http:HttpClient,private db: AngularFireDatabase) { }
  getSensorData(): Observable<Sensordata[]> {
    //return this.http.get<Sensordata[]>(this.apiURL);
    return this.sensorDataRef.valueChanges();

}
  getLastSensorData(): Observable<Sensordata> {
  /* return this.http.get<Sensordata[]>(this.apiURL).pipe(
    map(data => data[data.length - 1]) // Get the last entry
  ); */
  return this.getSensorData().pipe(
    map(data => data[data.length - 1]) // Get the last entry
  )
}
  saveSensorData(data:any){
      const Sensor_data={...data,timestamp: new Date().toISOString()};
      //return this.http.post(this.apiURL,Sensor_data);
      return this.sensorDataRef.push(Sensor_data);
  }
  getSensorsByDateRange(startDate: Date, endDate: Date): Observable<Sensordata[]> {
    return this.getSensorData().pipe(
      map((sensors: Sensordata[]) =>
        sensors.filter((sensor: { timestamp: string | number | Date; }) => {
          
          const sensorDate = new Date(sensor.timestamp);
          
          return sensorDate >= startDate && sensorDate <= endDate;
        })
      )
    );
  }

  getSensorsForDay(date: Date): Observable<Sensordata[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    //endDate.setHours(23, 59, 59, 999);
    return this.getSensorsByDateRange(startDate, endDate);
  }

  getSensorsForLastNDays(n: number): Observable<Sensordata[]> {
    const endDate = new Date();
       
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - n);
    startDate.setHours(0, 0, 0, 0);
    return this.getSensorsByDateRange(startDate, endDate);
  }

}

