import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {OlympicData} from "../../core/models/Olympic";
import {Router} from "@angular/router";
import {ChartDetails} from "../../core/models/ChartDetails";

type DashboardInformation = {
  totalParticipation: number,
  totalCountries: number,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  /**
   * Subscription for data updates.
   */
  public olympicsSubscription$: Subscription | undefined;

  /**
   * Observable for the country's Olympic data.
   */
  public olympics$: Observable<OlympicData> = of([]);

  /**
   * Gets the status of data fetching
   */
  public isFetching$: Observable<boolean> = of(false);

  /**
   *  Various information to be shown in UI
   */
  public generalInformation: { title: string; value: number }[] = [];

  /**
   * Input datasource for ngx-chart pie component
   */
  public chartDetails : ChartDetails[] = [];

  /**
   * Chart view size
   */
  public chartView: [number,number] = [700, 800];


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
          const dashBoardInfo = this.getDashboardInfo(values);
          this.generalInformation = [
            { title: 'Participations', value: dashBoardInfo.totalParticipation },
            { title: 'Number of countries', value: dashBoardInfo.totalCountries },
          ];
          this.chartDetails = this.getNumberOfMedalsByCountry(values);
        }
      }
    );
  }

  /**
   * Gets formatted data (a list of tuple country/number of medals) for ngx charts pie component datasource
   *
   * @param values
   * @returns {ChartDetails[]} An array of ChartDetails object.
   */
  getNumberOfMedalsByCountry(values: OlympicData) : ChartDetails[] {
    const chartDetails: ChartDetails[] = [];
    values.map((value)=> {
      const nbMedals: number = value.participations.reduce(
        (acc: number, currentValue) => acc+ currentValue.medalsCount, 0
      );
      chartDetails.push({
        name: value.country,
        value: nbMedals
      });
    });
    return chartDetails;
  }

  /**
   * Retrieves the number of countries and the number of participation for these
   *
   * @param values
   * @returns {DashboardInformation} A DashboardInformation object.
   */
  getDashboardInfo(values: OlympicData): DashboardInformation {
    const participationCount: number = values.reduce(
      (acc, cur) => acc + cur.participations.length, 0
    );

    const nbCountries = values.length;
    return { totalParticipation: participationCount, totalCountries: nbCountries };
  }

  /**
   * Function triggered by the click event on the pie chart slice
   * Navigates to the detail page and passes the selected country
   * @param obj
   */
  selectCountryByName(obj: ChartDetails) {
    //event.name is the country is the string parameter passed to the details page
    this.routerService.navigate(
      ['/details'],
      { queryParams: { country: obj.name } }
    );
  }
}
