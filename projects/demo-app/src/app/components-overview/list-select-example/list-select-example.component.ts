import { ChangeDetectionStrategy, Component, computed, linkedSignal, model, signal } from '@angular/core';
import {
  LuxButtonComponent,
  LuxInputAcComponent,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxMenuTriggerComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import {
  ILuxListSelectHttpDao,
  LuxListSelectActionDirective,
  LuxListSelectActionPosition,
  LuxListSelectComponent,
  LuxListSelectMode,
  LuxListSelectSize
} from '@ihk-gfi/lux-components/lux-list-select';
import { LuxPageEvent } from '@ihk-gfi/lux-components/lux-paginator';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { ListSelectExampleHttpDao } from './list-select-example-http-dao';

export interface DemoAdresse {
  title: string;
  subTitle: string;
  disabled?: boolean;
}

// Initialer Ausschnitt für den client-seitigen Infinite-Scroll-Fall (ohne luxHttpDao) - siehe
// visibleItems() unten sowie das Wiki-Beispiel "Infinite Scrolling" für das zugrundeliegende Muster.
const INITIAL_LOADED_COUNT = 6;

const ALLE_ADRESSEN: DemoAdresse[] = [
  { title: 'Anna Müller', subTitle: 'Berliner Str. 12, 10115 Berlin' },
  { title: 'Thomas Schmidt', subTitle: 'Hauptstr. 45, 80331 München' },
  { title: 'Laura Weber', subTitle: 'Rheinweg 7, 50667 Köln' },
  { title: 'Markus Fischer', subTitle: 'Schillerplatz 3, 70173 Stuttgart', disabled: true },
  { title: 'Sophie Braun', subTitle: 'Alsterufer 22, 20354 Hamburg' },
  { title: 'Jan Hoffmann', subTitle: 'Goethestr. 18, 60313 Frankfurt' },
  { title: 'Lisa Schneider', subTitle: 'Marktplatz 9, 01067 Dresden' },
  { title: 'Felix Wagner', subTitle: 'Kaiserstr. 31, 76131 Karlsruhe' },
  { title: 'Marie Becker', subTitle: 'Lindenallee 5, 04109 Leipzig' },
  { title: 'David Zimmermann', subTitle: 'Schlossstr. 14, 40213 Düsseldorf' },
  { title: 'Clara Hartmann', subTitle: 'Friedrichstr. 28, 30159 Hannover' }
];

@Component({
  selector: 'app-list-select-example',
  templateUrl: './list-select-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxListSelectComponent,
    LuxListSelectActionDirective,
    LuxButtonComponent,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxMenuTriggerComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class ListSelectExampleComponent {
  log = logResult;

  readonly alleAdressen = signal<DemoAdresse[]>(ALLE_ADRESSEN);

  readonly sizeOptions: { label: string; value: LuxListSelectSize }[] = [
    { label: 'default', value: 'default' },
    { label: 'small', value: 'small' },
    { label: 'xsmall', value: 'xsmall' }
  ];

  readonly actionTypeOptions: { label: string; value: 'none' | 'button' | 'menu' }[] = [
    { label: 'Keine Aktion', value: 'none' },
    { label: 'Icon-Button', value: 'button' },
    { label: 'Menü (lux-menu)', value: 'menu' }
  ];

  readonly actionPositionOptions: { label: string; value: LuxListSelectActionPosition }[] = [
    { label: 'right', value: 'right' },
    { label: 'left', value: 'left' }
  ];

  readonly pageSizeOptions: { label: string; value: number }[] = [
    { label: '3', value: 3 },
    { label: '5', value: 5 },
    { label: '10', value: 10 }
  ];

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
  size = model<LuxListSelectSize>('default');
  showCounter = model(true);
  selectAllLabel = model('Alle Adressen');
  titleProp = model('title');
  subTitleProp = model('subTitle');
  showOutputEvents = model(false);
  showPagination = model(false);
  infiniteScroll = model(false);
  actionType = model<'none' | 'button' | 'menu'>('none');
  actionPosition = model<LuxListSelectActionPosition>('right');
  disabled = model(false);
  errorMessage = model<string>('');
  maxHeight = model('420px');
  pageSize = model(5);

  showSearch = model(false);
  searchDelay = model(300);
  searchValue = model('');
  useHttpDao = model(false);

  pageIndex = model(0);
  selected = signal<DemoAdresse[]>([]);

  // Sucheingabe sowie ein Wechsel des Modus (Server-DAO an/aus, Infinite Scroll an/aus) setzen
  // den client-seitig geladenen Ausschnitt auf den Initialwert zurück.
  loadedCount = linkedSignal({
    source: () => ({ search: this.searchValue(), dao: this.useHttpDao(), infinite: this.infiniteScroll() }),
    computation: () => INITIAL_LOADED_COUNT
  });

  // Bei Aktivierung des Toggles wird ein neues DAO-Objekt gebunden (Server-Simulation), bei
  // Deaktivierung liefert der Computed wieder "undefined" -> die Komponente fällt zurück auf
  // luxItems und ihre eigene Client-Filterung/-Slicing.
  httpDao = computed<ILuxListSelectHttpDao<DemoAdresse> | undefined>(() =>
    this.useHttpDao() ? new ListSelectExampleHttpDao(this.alleAdressen()) : undefined
  );

  // Client-Modus (kein luxHttpDao): Bei aktiver Paginierung schneidet die Komponente selbst zu,
  // deshalb wird ihr die vollständige Liste übergeben. Bei aktivem Infinite Scrolling schneidet
  // die Komponente dagegen NICHT selbst - die aufrufende Seite liefert weiterhin nur den bisher
  // geladenen Ausschnitt über luxItems und erweitert ihn in onScrolled() (siehe Wiki-Beispiel
  // "Infinite Scrolling"). Ist ein DAO gebunden, übernimmt dieser Paging/Scrolling serverseitig.
  visibleItems = computed(() => {
    if (this.infiniteScroll() && !this.useHttpDao()) {
      return this.alleAdressen().slice(0, this.loadedCount());
    }
    return this.alleAdressen();
  });

  clearItems() {
    this.alleAdressen.set([]);
    this.selected.set([]);
  }

  addItem() {
    const nr = this.alleAdressen().length + 1;
    this.alleAdressen.update((items) => [
      ...items,
      {
        title: `Neuer Eintrag ${nr} mit einem sehr langen Titel, der in der Karte abgeschnitten werden muss`,
        subTitle: `Sehr lange Adresszeile ${nr}, Musterstraße 123, 12345 Musterstadt, Gebäude B, 3. Etage, Raum 301`
      }
    ]);
  }

  resetItems() {
    this.alleAdressen.set(ALLE_ADRESSEN);
    this.selected.set([]);
  }

  onPageChange(event: LuxPageEvent) {
    this.log(this.showOutputEvents(), 'luxPageChange', event);
  }

  onScrolled() {
    this.log(this.showOutputEvents(), 'luxScrolled');
    if (!this.useHttpDao()) {
      this.loadedCount.update((count) => Math.min(count + 3, this.alleAdressen().length));
    }
  }

  onSelectedChange(selected: DemoAdresse[]) {
    this.selected.set(selected);
    this.log(this.showOutputEvents(), 'luxSelectedChange', selected);
  }

  onAction(action: string, item: DemoAdresse) {
    this.log(this.showOutputEvents(), action, item);
  }
}
