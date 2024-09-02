import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdafruitIoService {
  private baseUrl='https://io.adafruit.com/api/v2';
  private username='nghiahogia';
  private apiKey='';  
  private httpOptions= {
    headers: new HttpHeaders({
      'X-AIO-Key': this.apiKey
    })
  }

  constructor(private http:HttpClient) { }
  getFeedValue(feedKey: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.username}/feeds/${feedKey}/data`, this.httpOptions);
  }

  sendFeedValue(feedKey: string, value: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.username}/feeds/${feedKey}/data`, { value }, this.httpOptions);
  }
}
