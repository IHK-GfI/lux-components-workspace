import { Component } from '@angular/core';
import { LuxTabComponent, LuxTabsComponent } from '@ihk-gfi/lux-components';
import { BaselineAccordionComponent } from './baseline-accordion/baseline-accordion.component';
import { BaselineCardComponent } from './baseline-card/baseline-card.component';
import { BaselineComponent } from './baseline/baseline.component';

@Component({
  selector: 'lux-baseline-example',
  templateUrl: './baseline-example.component.html',
  styleUrls: ['./baseline-example.component.scss'],
  imports: [LuxTabsComponent, LuxTabComponent, BaselineComponent, BaselineCardComponent, BaselineAccordionComponent]
})
export class BaselineExampleComponent {
  constructor() {}
}
