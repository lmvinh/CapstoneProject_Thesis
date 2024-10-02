import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { NotfoundComponent } from './notfound/notfound.component';

import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { GaugeChartModule } from 'angular-gauge-chart'
import { NgxGaugeModule } from 'ngx-gauge';
import 'chartjs-adapter-moment'
//import 'chartjs-adapter-luxon';

import { HttpClient, HttpClientModule } from '@angular/common/http';
//import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import mqtt from "mqtt";
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MainComponent } from './main/main.component';
import { TopMainComponent } from './top-main/top-main.component';
import { TempChartComponent } from './temp-chart/temp-chart.component';
import { HumiChartComponent } from './chart-main/humi-chart.component';
import { LogComponent } from './log/log.component';
import { MqttBrokerComponent } from './mqtt-broker/mqtt-broker.component';
import { CalendarComponent } from './calendar/calendar.component';

import  { AngularFireModule  } from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';






@NgModule({
  declarations: [
    AppComponent,
    DasboardComponent,
    NotfoundComponent,
    HeaderComponent,
    SideNavComponent,
    MainComponent,
    TopMainComponent,
    TempChartComponent,
    HumiChartComponent,
    LogComponent,
    MqttBrokerComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    
    NgxGaugeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    
    
    
    
  ],
  providers: [MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
