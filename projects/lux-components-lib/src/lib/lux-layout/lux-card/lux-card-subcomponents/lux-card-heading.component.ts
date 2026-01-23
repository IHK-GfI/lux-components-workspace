import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgClass } from '@angular/common';
@Component({
  selector: 'lux-card-heading',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (luxLevel()) { @case (1) {
    <h1 class="lux-card-heading-h1" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h1>
    } @case (2) {
    <h2 class="lux-card-heading-h2" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h2>
    } @case (3) {
    <h3 class="lux-card-heading-h3" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h3>
    } @case (4) {
    <h4 class="lux-card-heading-h4" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h4>
    } @case (5) {
    <h5 class="lux-card-heading-h5" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h5>
    } @case (6) {
    <h6 class="lux-card-heading-h6" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h6>
    } @default {
    <h2 class="lux-card-heading-h2" [ngClass]="luxClass()" [title]="luxTitle()">{{ luxText() }}</h2>
    } }
  `
})
export class LuxCardHeadingComponent {
  luxLevel = input<number>(2);
  luxText = input<string | undefined>('');
  luxTitle = input<string | undefined>('');
  luxClass = input<any>(undefined);
}
