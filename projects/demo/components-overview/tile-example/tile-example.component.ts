import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import {
    LuxAutofocusDirective,
    LuxFormHintComponent,
    LuxIconComponent,
    LuxImageComponent,
    LuxInputAcComponent,
    LuxTileComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'lux-tile-example',
  templateUrl: './tile-example.component.html',
  standalone: true,
  imports: [
    LuxImageComponent,
    LuxIconComponent,
    LuxTileComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class TileExampleComponent {
  showIcon = true;
  showOutputEvents = false;
  counter = undefined;
  counterCap = 20;
  label = 'Tile Example';
  log = logResult;
  _showNotification = false;
  showShadow = true;

  get showNotification() {
    return this._showNotification;
  }

  set showNotification(show: boolean) {
    this._showNotification = show;

    if (show && this.counter) {
      this.counter = undefined;
    }
  }

  constructor() {}
}

