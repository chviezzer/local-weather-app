import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ICurrentWeather } from '../interfaces/icurrent-weather';
import { Injectable } from '@angular/core';
import { PostalCodeService } from './postal-code.service';


export interface ICurrentWeatherData {
  weather: [{
    icon: string,
    descritpion: string,
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

export const defaultWeather: ICurrentWeather = {
  city: '--',
  country: '--',
  date: Date.now(),
  image: '',
  temperature: 0,
  description: '',
   
}
export interface IWeatherService   {
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>
  getCurrentWeather(city: string, country?: string): Observable<ICurrentWeather>
  getCurrentWeatherByCoords(coords: any): Observable<ICurrentWeather>
  updateCurrentWeather(searchText: string, country?: string): void

}
@Injectable({
  providedIn: 'root'
}) 

export class WeatherService implements IWeatherService {

  readonly currentWeather$ = new BehaviorSubject<ICurrentWeather>(defaultWeather)
  
  constructor(private httpClient: HttpClient, private postalCodeService: PostalCodeService ) { }

  getCurrentWeatherByCoords(coords: {
    latitude: number
    longitude: number
  }): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString())

    return this.getCurrentWeatherHelper(uriParams)
  }

  updateCurrentWeather(searchText: string, country?: string): void {
    this.getCurrentWeather(searchText, country).subscribe((weather) =>
      this.currentWeather$.next(weather)
    )
  }

  getCurrentWeather(searchText: string, country?: string): Observable<ICurrentWeather> {
    return this.postalCodeService.resolvePostalCode(searchText)
    .pipe(
      switchMap((postalCode) => {
        if (postalCode) {
          return this.getCurrentWeatherByCoords({
            latitude: postalCode.lat,
            longitude: postalCode.lng,
          })
        } else {
          const uriParams = new HttpParams().set(
            'q',
            country ? `${searchText},${country}` : searchText
          )

          return this.getCurrentWeatherHelper(uriParams)
        }
      })
    )
  }
    private getCurrentWeatherHelper(uriParams : HttpParams) :
      Observable<ICurrentWeather> {
        uriParams = uriParams.set('appid', environment.appId) 
      return this.httpClient
        .get<ICurrentWeatherData>(
          `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?&units=metric`,
            { params: uriParams }
        )
        .pipe(map(data => this.transformToICurrentWeather(data)))
  } 

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
}
