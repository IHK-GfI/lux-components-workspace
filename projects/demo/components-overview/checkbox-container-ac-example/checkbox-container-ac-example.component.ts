import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    LuxCheckboxAcComponent,
    LuxCheckboxContainerAcComponent,
    LuxInputAcComponent,
    LuxMediaQueryObserverService,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'checkbox-container-ac-example',
  templateUrl: './checkbox-container-ac-example.component.html',
  styleUrls: ['./checkbox-container-ac-example.component.scss'],
  imports: [
    LuxCheckboxContainerAcComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxCheckboxAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgClass,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class CheckboxContainerAcExampleComponent {
  private mediaQuery = inject(LuxMediaQueryObserverService);

  label = 'Optionales Label für den Container';
  isVertical = true;
  isSmall: boolean;
  subscriptions: Subscription[] = [];

  constructor() {
    this.isSmall = this.mediaQuery.isSmaller('md');
    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
        this.isSmall = this.mediaQuery.isSmaller('md');
      })
    );
  }
}
