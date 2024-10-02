import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
export interface RelayStatus
{
  relay1: boolean;
  relay2: boolean;
  relay3: boolean;
  relay4: boolean;
  timestamp: string;

}
@Injectable({
  providedIn: 'root'
})
export class RelayStatusService {
  //private apiURL= 'http://localhost:3000/relay-status';
  //private apiURL= 'http://10.0.112.139:3000/relay-status';
  //private apiURL= 'http://192.168.192.183:3000/relay-status';
  //private apiURL= 'http://172.28.182.157:3000/relay-status';
  private relayStatusRef = this.db.list<RelayStatus>('relay-status');
  constructor(private http:HttpClient,private db: AngularFireDatabase) { }

  saveRelaystate(state:any){
      const relayState={...state,timestamp: new Date().toISOString()};
      //return this.http.post(this.apiURL,relayState);
      this.relayStatusRef.push(relayState);
  }
  getRelayStatus(): Observable<RelayStatus[]> {
    //return this.http.get<RelayStatus[]>(this.apiURL);
    return this.relayStatusRef.valueChanges(); // Fetching relay statuses from Firebase
  }
  getLastStatus(): Observable<RelayStatus> {
    //return this.http.get<RelayStatus[]>(this.apiURL).pipe(
    return this.getRelayStatus().pipe(
      map(data => data[data.length - 1]) // Get the last entry
    );
  }

}
