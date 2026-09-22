import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ILuxBreadcrumbEntry,
  LuxAutofocusDirective,
  LuxBreadcrumbComponent,
  LuxButtonComponent,
  LuxDividerComponent,
  LuxInputComponent,
  LuxLinkPlainComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

@Component({
  selector: 'lux-breadcrumb-example',
  templateUrl: './breadcrumb-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxBreadcrumbComponent,
    LuxLinkPlainComponent,
    LuxButtonComponent,
    LuxDividerComponent,
    LuxToggleComponent,
    LuxInputComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class BreadcrumbExampleComponent {
  private readonly router = inject(Router);

  readonly entries = signal<ILuxBreadcrumbEntry[]>([
    { name: 'Startseite', url: '/home' },
    { name: 'Komponenten', url: '/components-overview' },
    { name: 'lux-breadcrumb', url: '' }
  ]);

  readonly enableUrl = signal(false);

  readonly wrap = signal(false);
  readonly showOnlyFirstAndLast = signal(false);

  readonly clickedEntry = signal<ILuxBreadcrumbEntry | undefined>(undefined);

  readonly currentArea = signal<string | undefined>('Übersicht');

  readonly entriesExample = signal<ILuxBreadcrumbEntry[]>([{ name: 'Übersicht', url: 'Übersicht' }]);

  updateView(): void {
    this.entries.update((entries) => [...entries]);
  }

  addEntry(): void {
    const newEntry = {
      name: '',
      url: ''
    };
    this.entries.update((entries) => [...entries, newEntry]);
  }

  onClickedEntry(entry: ILuxBreadcrumbEntry): void {
    this.clickedEntry.set(entry);

    this.entries.update((entries) => entries.slice(0, entries.findIndex((currentEntry) => currentEntry.name === entry.name) + 1));

    if (this.enableUrl() && entry.url) {
      this.router.navigate([entry.url]);
    }
  }

  onBreadcrumbClick(entry: ILuxBreadcrumbEntry): void {
    this.currentArea.set(entry.url);
    this.entriesExample.update((entries) => entries.slice(0, entries.findIndex((currentEntry) => currentEntry.name === entry.name) + 1));
  }

  onSwitchArea(area: string): void {
    this.currentArea.set(area);
    const newEntry = {
      name: area,
      url: area
    };

    this.entriesExample.update((entries) => [...entries, newEntry]);
  }
}
