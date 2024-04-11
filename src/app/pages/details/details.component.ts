import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable, of, Subscription} from "rxjs";
import {SpinLoaderComponent} from "../../component/spin-loader/spin-loader.component";
import {Country} from "../../core/models/Olympic";
import {ChartDetails} from "../../core/models/ChartDetails";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {TileInformationComponent} from "../../component/tile-information/tile-information.component";

type DetailsInformation = {
  totalEntries: number,
  totalMedals: number,
  totalAthletes: number
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    SpinLoaderComponent,
    NgxChartsModule,
    TileInformationComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent implements OnInit, OnDestroy {

  /**
   * Gets the status of data fetching
   */
  public isFetching$: Observable<boolean> = of(false);

  /**
   * Observable for the country's Olympic data.
   */
  public olympicCountry$: Observable<Country|undefined> = of(undefined);

  /**
   * Subscription for data updates.
   */
  public olympicCountrySubscription$!: Subscription;

  /**
   * Country for which data are displayed within this page
   */
  public selectedCountry: string = '';

  /**
   * Is country passed in parameter a valid country that has existing data been successfully fetched?
   */
  public isSelectedCountryValid: boolean = true;

  /**
   * Input datasource for ngx-chart histogram component
   */
  public chartDetails: ChartDetails[] = [];

  /**
   * Array of various information to be shown in UI
   */
  public detailsInformation: { title: string; value: number }[] = [];

  constructor(private olympicService: OlympicService,
              private activatedRoute: ActivatedRoute,
              private routerService: Router) {
    this.selectedCountry = this.activatedRoute.snapshot.queryParams['country'];
    this.isFetching$ = this.olympicService.getIsFetchingData();
    this.olympicCountry$ = this.olympicService.getOlympicCountryDataByName(this.selectedCountry);
  }

  ngOnInit(): void {
    this.olympicCountrySubscription$ = this.olympicCountry$.subscribe(
      (country : Country | undefined) => {
        country ? this.isSelectedCountryValid = true : this.isSelectedCountryValid = false;

        if(this.isSelectedCountryValid){
          this.chartDetails = this.getChartDetailsForCountry(country!);
          const detailsInfo = this.getDetailsInfoForCountry(country!);
          this.detailsInformation = [
            { title: 'Number of entries', value: detailsInfo.totalEntries },
            { title: 'Total number of medals', value: detailsInfo.totalMedals },
            { title: 'Total number of athletes', value: detailsInfo.totalAthletes },
          ];
        }
    });
  }

  ngOnDestroy(): void {
    this.olympicCountrySubscription$.unsubscribe();
  }

  /**
   * Gets formatted data (a list of tuple year/number of medals) for ngx charts datasource
   *
   * @param country
   * @returns {ChartDetails[]} An array of ChartDetails object.
   */
  getChartDetailsForCountry(country: Country): ChartDetails[] {
    const chartDetails: ChartDetails[] = [];
    for (let i = 0; i < country.participations.length; i++) {
      chartDetails.push({
        name: country.participations[i].year.toString(),
        value: country.participations[i].medalsCount
      });
    }

    return chartDetails;
  }

  /**
   * Retrieves the number of participation, medals, athletes for a given country
   *
   * @param country
   * @returns {DetailsInformation} A DetailsInformation object.
   */
  getDetailsInfoForCountry(country: Country): DetailsInformation {
    const countMedals: number = country.participations.reduce(
      (acc, cur) => acc + cur.medalsCount, 0
    );
    const countAthletes: number = country.participations.reduce(
      (acc, cur) => acc + cur.athleteCount, 0
    );
    return {
      totalEntries: country.participations.length,
      totalMedals: countMedals,
      totalAthletes: countAthletes
    }
  }

  /**
   * Navigate back to Homepage
   */
  goBackToHomePage(): void {
    this.routerService.navigateByUrl('/');
  }
}
