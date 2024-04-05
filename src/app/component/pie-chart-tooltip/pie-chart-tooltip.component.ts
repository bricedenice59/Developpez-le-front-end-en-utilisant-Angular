import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-pie-chart-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart-tooltip.component.html',
  styleUrl: './pie-chart-tooltip.component.scss'
})
export class PieChartTooltipComponent {
  @Input() country: string = '';
  @Input() medals: number = 0;
}
