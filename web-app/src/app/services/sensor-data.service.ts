import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
export interface Sensordata
{
  id: number;
  temp: number;
  humi: number;
  timestamp: string;
}
@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  private apiURL= 'http://10.0.129.187:3000/sensors';
  //private apiURL= 'assets/db3.json';
  constructor(private http:HttpClient) { }
  getSensorData(): Observable<Sensordata[]> {
    return this.http.get<Sensordata[]>(this.apiURL);
}
  getLastSensorData(): Observable<Sensordata> {
  return this.http.get<Sensordata[]>(this.apiURL).pipe(
    map(data => data[data.length - 1]) // Get the last entry
  );
}
  saveSensorData(data:any){
      const Sensor_data={...data,timestamp: new Date().toISOString()};
      return this.http.post(this.apiURL,Sensor_data);
  }
  getSensorsByDateRange(startDate: Date, endDate: Date): Observable<Sensordata[]> {
    return this.getSensorData().pipe(
      map((sensors: any[]) =>
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
    endDate.setHours(23, 59, 59, 999);
    return this.getSensorsByDateRange(startDate, endDate);
  }

  getSensorsForLastNDays(n: number): Observable<Sensordata[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - n);
    return this.getSensorsByDateRange(startDate, endDate);
  }

}

