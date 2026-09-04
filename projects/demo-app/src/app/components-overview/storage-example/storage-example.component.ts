import { AsyncPipe } from '@angular/common';
import { Component, DoCheck, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxStorageService,
  LuxToggleComponent
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxButtonComponent,
    LuxAriaLabelDirective,
    LuxToggleComponent,
    LuxInputComponent,
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

  readonly key = signal('Storage_Example_Key');
  readonly value = signal<string | null>('');
  readonly sensitive = signal(false);

  value$: Observable<string | null>;
  valueSubscription: Subscription;
  readonly localKeys = signal<string[]>([]);
  readonly storageLength = signal(0);

  constructor() {
    this.value$ = this.luxStorageService.getItemAsObservable(this.key());

    this.valueSubscription = this.value$.subscribe((newValue) => {
      this.value.set(newValue);
    });
  }

  ngDoCheck() {
    const len = this.luxStorageService.length;
    const keys = this.luxStorageService.getKeys();
    const localKeys = this.localKeys();
    const keysChanged = keys.length !== localKeys.length || keys.some((key, index) => key !== localKeys[index]);

    if (len !== this.storageLength() || keysChanged) {
      this.storageLength.set(len);
      this.localKeys.set(keys);
    }
  }

  ngOnDestroy() {
    this.valueSubscription.unsubscribe();
  }

  updateExisting(key: string, luxInput: LuxInputComponent) {
    if (!luxInput.value()) {
      throw Error('Null is not allowed!');
    }

    this.luxStorageService.setItem(key, luxInput.value(), false);
    luxInput.setValue('');
  }

  submit() {
    this.luxStorageService.setItem(this.key(), this.value() ? this.value()! : '', this.sensitive());
    this.key.set('');
    this.value.set('');
    this.sensitive.set(false);
  }

  clearAll() {
    this.luxStorageService.clearAll();
    this.value.set('');
    this.value$ = this.luxStorageService.getItemAsObservable(this.key());
  }

  clearSensitiveItems() {
    this.luxStorageService.clearSensitiveItems();
    this.value.set('');
    this.value$ = this.luxStorageService.getItemAsObservable(this.key());
  }
}
