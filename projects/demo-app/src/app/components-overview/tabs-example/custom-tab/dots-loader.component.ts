import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dots-loader',
  imports: [],
  templateUrl: './dots-loader.component.html',
  styleUrl: './dots-loader.component.scss',
  host: { class: 'lux-flex' }
})
export class DotsLoaderComponent {
  label = input<string>('Daten werden geladen');
}
