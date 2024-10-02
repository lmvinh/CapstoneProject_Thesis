import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DasboardComponent } from './dasboard/dasboard.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { MqttBrokerComponent } from './mqtt-broker/mqtt-broker.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  { path:"",component:DasboardComponent,pathMatch:"full"  },
  
  { path: "mqttBroker", component: MqttBrokerComponent },
  {path: "calendar", component: CalendarComponent},
  { path:"**",component:NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
