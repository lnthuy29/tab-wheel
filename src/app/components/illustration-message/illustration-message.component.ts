import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-illustration-message',
  templateUrl: './illustration-message.component.html',
  styleUrl: './illustration-message.component.scss',
  standalone: true,
  imports: [],
})
export class IllustrationMessageComponent {
  @Input() illustrationSrc: string = '';
  @Input() message: string = '';
}
