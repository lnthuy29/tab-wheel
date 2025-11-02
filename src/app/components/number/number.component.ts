import { Component, Input } from '@angular/core';

export interface NumberComponentProp {
  label: string;
  value: number;
  onClick?: Function;
}

@Component({
  selector: 'app-number',
  standalone: true,
  imports: [],
  templateUrl: './number.component.html',
  styleUrl: './number.component.scss',
})
export class NumberComponent {
  @Input() prop!: NumberComponentProp;
}
