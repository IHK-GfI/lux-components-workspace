import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import {
  LuxButtonComponent,
  LuxInputComponent,
  LuxLinkComponent,
  LuxLinkPlainComponent,
  LuxSelectComponent,
  LuxToggleComponent,
  LuxTooltipDirective
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-tooltip-example',
  templateUrl: './tooltip-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTooltipDirective,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxButtonComponent,
    LuxLinkComponent,
    LuxLinkPlainComponent
  ]
})
export class TooltipExampleComponent {
  positionOptions = ['left', 'right', 'above', 'below', 'before', 'after'];

  readonly message = signal('Tooltip');
  resizableMessage = 'Bericht für das vierte Quartal herunterladen';
  resizableMessageMultiline =
    'Der konsolidierte Bericht für das vierte Quartal enthält alle Kennzahlen der Regionen Nord, Süd, Ost und West inklusive der Prognose für das kommende Geschäftsjahr.';
  readonly disabled = signal(false);
  readonly hideDelay = signal(0);
  readonly showDelay = signal(0);
  readonly position = signal<TooltipPosition>('above');
}
