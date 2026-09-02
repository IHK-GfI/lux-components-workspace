import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  LuxButtonComponent,
  LuxCardActionAlignType,
  LuxCardActionsComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCardContentExpandedComponent,
  LuxCardCustomHeaderComponent,
  LuxCardInfoComponent,
  LuxFormHintComponent,
  LuxIconComponent,
  LuxImageComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxSnackbarService,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-card-example',
  templateUrl: './card-example.component.html',
  styleUrls: ['./card-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxButtonComponent,
    LuxCardActionsComponent,
    LuxCardContentExpandedComponent,
    LuxCardContentComponent,
    LuxCardInfoComponent,
    LuxCardComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxCardCustomHeaderComponent,
    StatusMarkerComponent,
    LuxImageComponent
  ]
})
export class CardExampleComponent {
  private readonly snackbar = inject(LuxSnackbarService);

  readonly showCustomHeader = signal(false);
  readonly showActions = signal(true);
  readonly showIcon = signal(true);
  readonly showInfo = signal(true);
  readonly useExpandableContent = signal(false);
  readonly btn2Raised = signal(true);
  readonly hideCardContent = signal(false);
  readonly disabled = signal(false);
  readonly titleLineBreak = signal(true);
  readonly title = signal(`Testkarte - Lorem ipsum dolor sit amet, consectetur adipisici elit.`);
  readonly titleTooltip = signal('');
  readonly subTitle = signal('Sed eiusmod tempor incidunt ut labore et dolore magna aliqua.');
  readonly subTitleTooltip = signal('');
  readonly heading = signal(2);
  readonly headingValidator = Validators.pattern('[1-6]');
  readonly closeLabel = signal('Weniger Inhalt Anzeigen');
  readonly openLabel = signal('Mehr Inhalt Anzeigen');
  readonly actionAlignOptions: { label: string; value: LuxCardActionAlignType }[] = [
    { label: 'Rechts', value: 'right' },
    { label: 'Links', value: 'left' }
  ];
  readonly actionAlign = signal<{ label: string; value: LuxCardActionAlignType }>(this.actionAlignOptions[0]);

  onCardClicked() {
    console.log('Card clicked');
    this.snackbar.open(3000, {
      text: 'Card clicked',
      iconName: 'lux-info'
    });
  }
}
