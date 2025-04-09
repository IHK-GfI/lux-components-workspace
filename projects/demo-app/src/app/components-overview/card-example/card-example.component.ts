import { Component, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import {
    LuxButtonComponent,
    LuxCardActionsComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCardContentExpandedComponent,
    LuxCardInfoComponent,
    LuxFormHintComponent,
    LuxIconComponent,
    LuxInputAcComponent,
    LuxSnackbarService,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-card-example',
  templateUrl: './card-example.component.html',
  styleUrls: ['./card-example.component.scss'],
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
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class CardExampleComponent {
  private snackbar = inject(LuxSnackbarService);

  showActions = true;
  showIcon = true;
  showInfo = true;
  useExpandableContent = false;
  btn2Raised = true;
  hideCardContent = false;
  disabled = false;
  titleLineBreak = true;
  title = `Testkarte - Lorem ipsum dolor sit amet, consectetur adipisici elit.`;
  titleTooltip = ``;
  subTitle = 'Sed eiusmod tempor incidunt ut labore et dolore magna aliqua.';
  subTitleTooltip = ``;
  iconName = 'lux-cogs';
  iconShowRight = true;
  raised = false;
  expanded = false;
  heading = 2;
  headingValidator = Validators.pattern('[1-6]');
  closeLabel = 'Weniger Inhalt Anzeigen';
  openLabel = 'Mehr Inhalt Anzeigen';

  onCardClicked() {
    console.log('Card clicked');
    this.snackbar.open(3000, {
      text: 'Card clicked',
      iconName: 'lux-info'
    });
  }
}
