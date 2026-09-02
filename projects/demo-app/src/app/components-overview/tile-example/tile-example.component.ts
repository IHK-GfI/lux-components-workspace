import { NgStyle } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
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
  selector: 'tile-example',
  templateUrl: './tile-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly showIcon = signal(true);
  readonly showOutputEvents = signal(false);
  readonly counter = signal<number | undefined>(undefined);
  readonly counterCap = signal(20);
  readonly label = signal('Tile Example');
  log = logResult;
  private readonly _showNotification = signal(false);
  readonly showShadow = signal(true);
  readonly truncateAfterOneLine = signal(false);
  readonly truncateAfterTwoLines = signal(false);

  get showNotification() {
    return this._showNotification();
  }

  set showNotification(show: boolean) {
    this._showNotification.set(show);

    if (show && this.counter()) {
      this.counter.set(undefined);
    }
  }
}
