import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {OlympicData} from "../../core/models/Olympic";

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

  constructor(private olympicService: OlympicService) {}

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
        }
      }
    );
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
}
