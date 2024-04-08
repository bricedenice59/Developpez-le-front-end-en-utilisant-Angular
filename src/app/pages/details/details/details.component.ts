import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../../../core/services/olympic.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable, of, Subscription} from "rxjs";
import {SpinLoaderComponent} from "../../../component/spin-loader/spin-loader.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    SpinLoaderComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent implements OnInit {
  public isFetching$: Observable<boolean> = of(false);
  public olympicCountry$: Observable<number|undefined> = of(undefined);
  public olympicCountrySubscription$!: Subscription;
  public countryFromPageParam:string;
  public hasCountryData: boolean = true;

  constructor(private olympicService: OlympicService,
              private activatedRoute: ActivatedRoute,
              private routerService: Router) {
    this.countryFromPageParam = this.activatedRoute.snapshot.queryParams['country'];
    this.isFetching$ = this.olympicService.getIsFetchingData();
    this.olympicCountry$ = this.olympicService.getOlympicCountryIdByName(this.countryFromPageParam);
  }

  ngOnInit(): void {
    this.olympicCountrySubscription$ = this.olympicCountry$.subscribe(
      (countryId : number | undefined) => {
        countryId ? this.hasCountryData = true : this.hasCountryData = false;
    });
  }

  goBackToHomePage(): void {
    this.routerService.navigateByUrl('/');
  }
}
