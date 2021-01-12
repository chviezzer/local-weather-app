import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICurrentWeather } from '../interfaces/icurrent-weather';
import { Injectable } from '@angular/core';


interface ICurrentWeatherData {
  weather: [{
    descritpion: string,
    icon: string
  }],
  main: {
    temp: number
  },
  sys: {
    country: string
  },
  dt: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private transformToICurrentWeather(data: ICurrentWeatherData):
  ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image:
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      temperature: data.main.temp,
      description: data.weather[0].descritpion,
    }
  }
  constructor(private httpClient: HttpClient) { }

  getCurrentweather(city: string, country: string):
    Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('q', `${city},${country}`)
      .set('appid', environment.appId)

    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?&units=metric`,
          { params: uriParams }
      )
      .pipe(map(data => this.transformToICurrentWeather(data)))
  }
}
