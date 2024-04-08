import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, delay, map, Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {Country, OlympicData} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicData>([]);
  private isFetchingData$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadInitialData() : Observable<OlympicData> {
    this.isFetchingData$.next(true);

    const fetchedOlympicObservable: Observable<OlympicData> = this.http.get<OlympicData>(this.olympicUrl);

    return fetchedOlympicObservable.pipe(
      delay(1000), //simulate some delay
      tap((data) => {
        this.isFetchingData$.next(false);
        return this.olympics$.next(data);
      }),
      catchError((error: string) => {
        console.error(error);
        this.isFetchingData$.next(false);
        this.olympics$.next([]);
        throw new Error(
          'An error occurred while loading Olympics data'
        );
      })
    );
  }

  getOlympics() : Observable<OlympicData> {
    return this.olympics$.asObservable();
  }

  getIsFetchingData(): Observable<boolean>{
    return this.isFetchingData$.asObservable();
  }

  getOlympicCountryDataByName(name: string): Observable<Country | undefined> {
    return this.olympics$.pipe(
      map((olympics) => {
          return olympics.find((obj: Country) => {
            return obj.country === name;
          });
      }),
    );
  }
}
