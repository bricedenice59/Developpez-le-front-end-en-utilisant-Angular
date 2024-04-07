import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  country:string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.country = this.activatedRoute.snapshot.queryParams['country'];
  }

}
