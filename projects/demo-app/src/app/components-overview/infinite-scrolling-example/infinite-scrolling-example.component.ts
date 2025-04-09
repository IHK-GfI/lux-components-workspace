import { Component } from '@angular/core';
import {
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxIconComponent,
    LuxInfiniteScrollDirective,
    LuxInputAcComponent,
    LuxListComponent,
    LuxListItemComponent,
    LuxListItemContentComponent,
    LuxListItemIconComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-infinite-scrolling-example',
  templateUrl: './infinite-scrolling-example.component.html',
  styleUrls: ['./infinite-scrolling-example.component.scss'],
  imports: [
    LuxIconComponent,
    LuxButtonComponent,
    LuxListComponent,
    LuxListItemContentComponent,
    LuxListItemIconComponent,
    LuxListItemComponent,
    LuxInfiniteScrollDirective,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseOptionsActionsComponent
  ]
})
export class InfiniteScrollingExampleComponent {
  showOutputEvents = false;
  listItems: string[] = [];
  log = logResult;
  created = false;

  immediateCallback = true;
  isLoading = false;
  scrollPercent = 85;

  constructor() {
    this.createListItems();
    this.recreateList();
  }

  recreateList() {
    this.created = false;
    setTimeout(() => {
      this.created = true;
    }, 500);
  }

  reset() {
    this.listItems = [];
    this.createListItems();
  }

  onScroll() {
    this.log(this.showOutputEvents, 'luxScrolled');
    this.createListItems();
  }

  trackByFn(index: number, _item: string) {
    return index;
  }

  private createListItems() {
    for (let i = 0; i < 10; i++) {
      this.listItems.push('Test #' + this.listItems.length);
    }
  }
}
