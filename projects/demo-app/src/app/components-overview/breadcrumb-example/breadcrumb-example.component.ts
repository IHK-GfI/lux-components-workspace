import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ILuxBreadcrumbEntry,
  LuxBreadcrumbComponent,
  LuxButtonComponent,
  LuxDividerComponent,
  LuxInputAcComponent,
  LuxLinkPlainComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

@Component({
  selector: 'lux-breadcrumb-example',
  templateUrl: './breadcrumb-example.component.html',
  imports: [
    LuxBreadcrumbComponent,
    LuxLinkPlainComponent,
    LuxButtonComponent,
    LuxDividerComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class BreadcrumbExampleComponent {
  router = inject(Router);

  public entries: ILuxBreadcrumbEntry[] = [
    { name: 'Startseite', url: '/home' },
    { name: 'Komponenten', url: '/components-overview' },
    { name: 'lux-breadcrumb', url: '' }
  ];

  public enableUrl = false;

  public clickedEntry?: ILuxBreadcrumbEntry;

  currentArea?: string = 'Übersicht';

  entriesExample: ILuxBreadcrumbEntry[] = [{ name: 'Übersicht', url: 'Übersicht' }];

  updateView() {
    this.entries = [...this.entries];
  }

  addEntry() {
    const newEntry = {
      name: '',
      url: ''
    };
    this.entries = [...this.entries, newEntry];
  }

  onClickedEntry(entry: ILuxBreadcrumbEntry) {
    this.clickedEntry = entry;

    this.entries = this.entries.slice(0, this.entries.findIndex((e) => e.name === entry.name) + 1);

    if (this.enableUrl && entry.url) {
      this.router.navigate([entry.url]);
    }
  }

  onBreadcrumbClick(entry: ILuxBreadcrumbEntry) {
    this.currentArea = entry.url;
    this.entriesExample = this.entriesExample.slice(0, this.entriesExample.findIndex((e) => e.name === entry.name) + 1);
  }

  onSwitchArea(area: string) {
    this.currentArea = area;
    const newEntry = {
      name: area,
      url: area
    };

    this.entriesExample = [...this.entriesExample, newEntry];
  }
}
