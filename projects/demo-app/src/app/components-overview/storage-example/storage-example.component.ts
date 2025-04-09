import { AsyncPipe } from '@angular/common';
import { Component, DoCheck, OnDestroy, inject } from '@angular/core';
import {
    LuxAriaLabelDirective,
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxStorageService,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { Observable, Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-storage-example',
  templateUrl: './storage-example.component.html',
  styleUrls: ['./storage-example.component.scss'],
  imports: [
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxButtonComponent,
    LuxAriaLabelDirective,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseOptionsActionsComponent,
    AsyncPipe
  ]
})
export class StorageExampleComponent implements OnDestroy, DoCheck {
  luxStorageService = inject(LuxStorageService);

  key = 'Storage_Example_Key';
  value: string | null = '';
  sensitive = false;

  value$: Observable<string | null>;
  valueSubscription: Subscription;

  localStorage = localStorage;
  storageLength = 0;

  constructor() {
    this.value$ = this.luxStorageService.getItemAsObservable(this.key);

    this.valueSubscription = this.value$.subscribe((newValue) => {
      this.value = newValue;
    });
  }

  ngDoCheck() {
    if (this.localStorage.length !== this.storageLength) {
      this.storageLength = this.localStorage.length;
    }
  }

  ngOnDestroy() {
    this.valueSubscription.unsubscribe();
  }

  updateExisting(key: string, luxInput: LuxInputAcComponent) {
    if (!luxInput.luxValue) {
      throw Error('Null is not allowed!');
    }

    this.luxStorageService.setItem(key, luxInput.luxValue, false);
    luxInput.luxValue = '';
  }

  submit() {
    this.luxStorageService.setItem(this.key, this.value ? this.value : '', this.sensitive);
    this.key = '';
    this.value = '';
    this.sensitive = false;
  }

  clearAll() {
    this.luxStorageService.clearAll();
    this.value = '';
    this.value$ = this.luxStorageService.getItemAsObservable(this.key);
  }

  clearSensitiveItems() {
    this.luxStorageService.clearSensitiveItems();
    this.value = '';
    this.value$ = this.luxStorageService.getItemAsObservable(this.key);
  }
}
