import { ChangeDetectionStrategy, Component, computed, effect, model, signal } from '@angular/core';
import {
  ILuxListSelectHttpDao,
  LuxInputAcComponent,
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
import { ListSelectExampleHttpDao } from './list-select-example-http-dao';

export interface DemoAdresse {
  label: string;
  subLabel: string;
  disabled?: boolean;
}

// Initialer Ausschnitt für den client-seitigen Infinite-Scroll-Fall (ohne luxHttpDao) - siehe
// visibleItems() unten sowie das Wiki-Beispiel "Infinite Scrolling" für das zugrundeliegende Muster.
const INITIAL_LOADED_COUNT = 6;

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
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ListSelectExampleComponent {
  log = logResult;

  readonly alleAdressen = ALLE_ADRESSEN;

  readonly modeOptions: { label: string; value: LuxListSelectMode }[] = [
    { label: 'multi', value: 'multi' },
    { label: 'single', value: 'single' }
  ];

  readonly searchDelayOptions: { label: string; value: number }[] = [
    { label: 'Kein Delay (0 ms)', value: 0 },
    { label: 'Standard (300 ms)', value: 300 },
    { label: 'Langsam (1000 ms)', value: 1000 }
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

  showSearch = model(false);
  searchDelay = model(300);
  searchValue = model('');
  useHttpDao = model(false);

  pageIndex = model(0);
  selected = signal<DemoAdresse[]>([]);
  loadedCount = signal(INITIAL_LOADED_COUNT);

  // Bei Aktivierung des Toggles wird ein neues DAO-Objekt gebunden (Server-Simulation), bei
  // Deaktivierung liefert der Computed wieder "undefined" -> die Komponente fällt zurück auf
  // luxItems und ihre eigene Client-Filterung/-Slicing.
  httpDao = computed<ILuxListSelectHttpDao<DemoAdresse> | undefined>(() =>
    this.useHttpDao() ? new ListSelectExampleHttpDao(this.alleAdressen) : undefined
  );

  // Client-Modus (kein luxHttpDao): Bei aktiver Paginierung schneidet die Komponente selbst zu,
  // deshalb wird ihr die vollständige Liste übergeben. Bei aktivem Infinite Scrolling schneidet
  // die Komponente dagegen NICHT selbst - die aufrufende Seite liefert weiterhin nur den bisher
  // geladenen Ausschnitt über luxItems und erweitert ihn in onScrolled() (siehe Wiki-Beispiel
  // "Infinite Scrolling"). Ist ein DAO gebunden, übernimmt dieser Paging/Scrolling serverseitig.
  visibleItems = computed(() => {
    if (this.infiniteScroll() && !this.useHttpDao()) {
      return this.alleAdressen.slice(0, this.loadedCount());
    }
    return this.alleAdressen;
  });

  constructor() {
    // Sucheingabe sowie ein Wechsel des Modus (Server-DAO an/aus, Infinite Scroll an/aus) setzen
    // den client-seitig geladenen Ausschnitt auf den Initialwert zurück.
    effect(() => {
      this.searchValue();
      this.useHttpDao();
      this.infiniteScroll();
      this.loadedCount.set(INITIAL_LOADED_COUNT);
    });
  }

  onPageChange(event: LuxPageEvent) {
    this.log(this.showOutputEvents(), 'luxPageChange', event);
  }

  onScrolled() {
    this.log(this.showOutputEvents(), 'luxScrolled');
    if (!this.useHttpDao()) {
      this.loadedCount.update((count) => Math.min(count + 3, this.alleAdressen.length));
    }
  }

  onSelectedChange(selected: DemoAdresse[]) {
    this.selected.set(selected);
    this.log(this.showOutputEvents(), 'luxSelectedChange', selected);
  }

  onDetail(item: DemoAdresse) {
    this.log(this.showOutputEvents(), 'luxDetailClicked', item);
  }
}
