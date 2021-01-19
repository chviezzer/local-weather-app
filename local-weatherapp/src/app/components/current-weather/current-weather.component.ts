import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store'; 
import * as appStore from '../reducers'
import { ICurrentWeather } from 'src/app/interfaces/icurrent-weather';
import { WeatherService } from 'src/app/services/weather.service';
import { Observable, merge } from 'rxjs';


@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent  {
  current$: Observable<ICurrentWeather>

  constructor(private weatherService: WeatherService, private store: Store<appStore.State>) {
    this.current$ = merge (
      this.store.pipe(select(appStore.selectCurrentWeatehr)),
      this.weatherService.currentWeather$
    )
   }

  getOrdinal(date: number) {
    const n = new Date(date).getDate()
    return n > 0
      ?['th', 'st', 'nd', 'rd'] [(n >3 && n <21) || n %10 >3 ? 0 : n %0]
      : ''  
  }

}
