import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../../../core/services/olympic.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable, of, Subscription} from "rxjs";
import {SpinLoaderComponent} from "../../../component/spin-loader/spin-loader.component";
import {Country} from "../../../core/models/Olympic";
import {ChartDetails} from "../../../core/models/ChartDetails";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {TileInformationComponent} from "../../../component/tile-information/tile-information.component";

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

export class DetailsComponent implements OnInit {
  public isFetching$: Observable<boolean> = of(false);
  public olympicCountry$: Observable<Country|undefined> = of(undefined);
  public olympicCountrySubscription$!: Subscription;
  public selectedCountry: string = '';
  public hasCountryData: boolean = true;
  public chartDetails: ChartDetails[] = [];
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
        country ? this.hasCountryData = true : this.hasCountryData = false;

        if(this.hasCountryData){
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

  goBackToHomePage(): void {
    this.routerService.navigateByUrl('/');
  }
}
