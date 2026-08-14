import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import {
  LuxIconComponent,
  LuxInputAcComponent,
  LuxInputAcPrefixComponent,
  LuxListSelectComponent,
  LuxListSelectMode,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { LuxPageEvent } from '@ihk-gfi/lux-components/lux-paginator';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

interface DemoAdresse {
  label: string;
  subLabel: string;
  disabled?: boolean;
}

const ALLE_ADRESSEN: DemoAdresse[] = [
  { label: 'Anna Müller', subLabel: 'Berliner Str. 12, 10115 Berlin' },
  { label: 'Thomas Schmidt', subLabel: 'Hauptstr. 45, 80331 München' },
  { label: 'Laura Weber', subLabel: 'Rheinweg 7, 50667 Köln' },
  { label: 'Markus Fischer', subLabel: 'Schillerplatz 3, 70173 Stuttgart', disabled: true },
  { label: 'Sophie Braun', subLabel: 'Alsterufer 22, 20354 Hamburg' },
  { label: 'Jan Hoffmann', subLabel: 'Goethestr. 18, 60313 Frankfurt' },
  { label: 'Lisa Schneider', subLabel: 'Marktplatz 9, 01067 Dresden' },
  { label: 'Felix Wagner', subLabel: 'Kaiserstr. 31, 76131 Karlsruhe' },
  { label: 'Marie Becker', subLabel: 'Lindenallee 5, 04109 Leipzig' },
  { label: 'David Zimmermann', subLabel: 'Schlossstr. 14, 40213 Düsseldorf' },
  { label: 'Clara Hartmann', subLabel: 'Friedrichstr. 28, 30159 Hannover' }
];

@Component({
  selector: 'app-list-select-example',
  templateUrl: './list-select-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxListSelectComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxIconComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ListSelectExampleComponent {
  log = logResult;

  readonly modeOptions: { label: string; value: LuxListSelectMode }[] = [
    { label: 'multi', value: 'multi' },
    { label: 'single', value: 'single' }
  ];

  mode = model<LuxListSelectMode>('multi');
  showOutputEvents = model(false);
  showPagination = model(false);
  infiniteScroll = model(false);
  showDetailButton = model(false);
  disabled = model(false);
  errorMessage = model<string>('');
  maxHeight = model('420px');
  pageSize = 5;

  filter = model('');
  pageIndex = model(0);
  selected = signal<DemoAdresse[]>([]);
  loadedCount = signal(6);

  filtered = computed(() => {
    const term = this.filter().toLowerCase();
    return ALLE_ADRESSEN.filter((adresse) => adresse.label.toLowerCase().includes(term) || adresse.subLabel.toLowerCase().includes(term));
  });

  visibleItems = computed(() => {
    if (this.showPagination()) {
      const start = this.pageIndex() * this.pageSize;
      return this.filtered().slice(start, start + this.pageSize);
    }
    if (this.infiniteScroll()) {
      return this.filtered().slice(0, this.loadedCount());
    }
    return this.filtered();
  });

  onPageChange(event: LuxPageEvent) {
    this.log(this.showOutputEvents(), 'luxPageChange', event);
  }

  onScrolled() {
    this.log(this.showOutputEvents(), 'luxScrolled', this.loadedCount());
    this.loadedCount.update((count) => Math.min(count + 3, this.filtered().length));
  }

  onSelectedChange(selected: DemoAdresse[]) {
    this.selected.set(selected);
    this.log(this.showOutputEvents(), 'luxSelectedChange', selected);
  }

  onDetail(item: DemoAdresse) {
    this.log(this.showOutputEvents(), 'luxDetailClicked', item);
  }
}
