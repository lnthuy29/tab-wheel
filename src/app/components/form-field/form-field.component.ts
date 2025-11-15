import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormFieldComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() type!: string;
}
