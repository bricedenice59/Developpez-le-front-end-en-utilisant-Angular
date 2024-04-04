import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tile-information',
  standalone: true,
  imports: [],
  templateUrl: './tile-information.component.html',
  styleUrl: './tile-information.component.scss'
})
export class TileInformationComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
}
