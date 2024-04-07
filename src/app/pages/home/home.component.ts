import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {OlympicData} from "../../core/models/Olympic";
import {Medal} from "../../core/models/Medals";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympicsSubscription$: Subscription | undefined;
  public olympics$: Observable<OlympicData> = of([]);
  public isFetching$: Observable<boolean> = of(false);
  public generalInformation: { title: string; value: number }[] = [];
  public medals : Medal[] = [];

  constructor(private olympicService: OlympicService, private routerService: Router) {}

  ngOnDestroy(): void {
    this.olympicsSubscription$?.unsubscribe();
    }

  ngOnInit(): void {
    this.isFetching$= this.olympicService.getIsFetchingData();
    this.olympics$ = this.olympicService.getOlympics();

    this.olympicsSubscription$ = this.olympics$.subscribe(
      (values: OlympicData) => {
        const hasNoData: boolean = values.length == 0;
        if (!hasNoData) {
          this.setInfo(values);
          this.setMedalsByCountry(values);
          console.log(this.medals);
        }
      }
    );
  }

  setMedalsByCountry(values: OlympicData) : void {
    this.medals = values.map((values)=> {
      const nbMedals: number = values.participations.reduce(
        (acc: number, currentValue) => acc+ currentValue.medalsCount, 0
      );

      return {
        id: values.id,
        name: values.country,
        value: nbMedals
      };
    });
  }

  setInfo(values: OlympicData): void {
    const participations: number = values.reduce(
      (acc, cur) => acc + cur.participations.length, 0
    );

    this.generalInformation = [
      { title: 'Participations', value: participations },
      { title: 'Number of countries', value: values.length },
    ];
  }

  selectCountryById(event: Medal) {
    //event.name is the country is the string parameter passed to the details page
    this.routerService.navigate(
      ['/details'],
      { queryParams: { country: event.name } }
    );
  }
}
