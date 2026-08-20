import { DOWN_ARROW, END, ESCAPE, HOME, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxPageEvent } from '@ihk-gfi/lux-components/lux-paginator';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxListSelectComponent } from './lux-list-select.component';
import {
  ILuxListSelectHttpDao,
  ILuxListSelectHttpDaoConf,
  ILuxListSelectHttpDaoStructure
} from './lux-list-select-model/lux-list-select-http-dao.interface';
import { LuxListSelectMode } from './lux-list-select-model/lux-list-select-types';

interface TestAdresse {
  label: string;
  subLabel?: string;
  disabled?: boolean;
}

const TEST_ITEMS: TestAdresse[] = [
  { label: 'Anna Müller', subLabel: 'Berliner Str. 12, 10115 Berlin' },
  { label: 'Thomas Schmidt', subLabel: 'Hauptstr. 45, 80331 München' },
  { label: 'Laura Weber', subLabel: 'Rheinweg 7, 50667 Köln', disabled: true },
  { label: 'Markus Fischer', subLabel: 'Schillerplatz 3, 70173 Stuttgart' }
];

const OTHER_PAGE_ITEM: TestAdresse = { label: 'Clara Hartmann', subLabel: 'Friedrichstr. 28, 30159 Hannover' };

const DAO_ITEMS: TestAdresse[] = [
  { label: 'Anna Müller' },
  { label: 'Thomas Schmidt' },
  { label: 'Laura Weber' },
  { label: 'Markus Fischer' },
  { label: 'Clara Hartmann' }
];

class TestListSelectHttpDao implements ILuxListSelectHttpDao<TestAdresse> {
  loadDataSpy = jasmine.createSpy('loadData');

  loadData(conf: ILuxListSelectHttpDaoConf): Observable<ILuxListSelectHttpDaoStructure<TestAdresse>> {
    this.loadDataSpy(conf);
    let source = DAO_ITEMS;
    if (conf.filter) {
      const term = conf.filter.toLowerCase();
      source = source.filter((item) => item.label.toLowerCase().includes(term));
    }
    const start = conf.page * conf.pageSize;
    const items = source.slice(start, start + conf.pageSize);
    return of({ items, totalCount: source.length }).pipe(delay(50));
  }
}

/**
 * DAO-Mock für den Fehlerpfad (Deferred-Finding #2): shouldFail steuert, ob loadData mit einem
 * Fehler fehlschlägt oder normal Daten liefert - so lässt sich prüfen, dass der Trigger-Stream
 * einen einzelnen fehlgeschlagenen Request übersteht und beim nächsten Trigger wieder lädt.
 */
class FailingListSelectHttpDao implements ILuxListSelectHttpDao<TestAdresse> {
  loadDataSpy = jasmine.createSpy('loadData');
  shouldFail = true;

  loadData(conf: ILuxListSelectHttpDaoConf): Observable<ILuxListSelectHttpDaoStructure<TestAdresse>> {
    this.loadDataSpy(conf);
    if (this.shouldFail) {
      return throwError(() => new Error('DAO-Fehler')).pipe(delay(50));
    }
    const start = conf.page * conf.pageSize;
    const items = DAO_ITEMS.slice(start, start + conf.pageSize);
    return of({ items, totalCount: DAO_ITEMS.length }).pipe(delay(50));
  }
}

describe('LuxListSelectComponent', () => {
  let fixture: ComponentFixture<MockHostComponent>;
  let host: MockHostComponent;
  let listSelect: LuxListSelectComponent<TestAdresse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockHostComponent],
      providers: [provideLuxTranslocoTesting(), provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(MockHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    listSelect = fixture.debugElement.query(By.directive(LuxListSelectComponent)).componentInstance;
  });

  it('Sollte erstellt werden', () => {
    expect(listSelect).toBeTruthy();
  });

  describe('Rendering', () => {
    it('Sollte alle Items mit Titel und Untertitel rendern', () => {
      // Vorbedingungen testen
      const cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(4);
      // Nachbedingungen prüfen
      expect(cards[0].nativeElement.textContent).toContain('Anna Müller');
      expect(cards[0].nativeElement.textContent).toContain('Berliner Str. 12, 10115 Berlin');
    });

    it('Sollte im Multi-Modus Checkboxen und im Single-Modus Radio-Buttons rendern', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card mat-checkbox')).length).toBe(4);
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card mat-radio-button')).length).toBe(0);

      // Änderungen durchführen
      host.mode = 'single';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card mat-checkbox')).length).toBe(0);
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card mat-radio-button')).length).toBe(4);
    });
  });

  describe('Selektion', () => {
    it('Sollte im Multi-Modus mehrere Items selektieren und wieder deselektieren', () => {
      // Vorbedingungen testen
      expect(host.selected).toEqual([]);

      // Änderungen durchführen
      listSelect.toggleItem(TEST_ITEMS[0]);
      listSelect.toggleItem(TEST_ITEMS[1]);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[0], TEST_ITEMS[1]]);

      listSelect.toggleItem(TEST_ITEMS[0]);
      fixture.detectChanges();
      expect(host.selected).toEqual([TEST_ITEMS[1]]);
    });

    it('Sollte im Single-Modus immer nur ein Item selektieren', () => {
      // Vorbedingungen testen
      host.mode = 'single';
      fixture.detectChanges();

      // Änderungen durchführen
      listSelect.toggleItem(TEST_ITEMS[0]);
      listSelect.toggleItem(TEST_ITEMS[1]);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[1]]);
    });

    it('Sollte ein Klick auf die Karte das Item selektieren', () => {
      // Änderungen durchführen
      const card = fixture.debugElement.queryAll(By.css('.lux-list-select-card'))[1];
      card.nativeElement.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[1]]);
    });

    it('Sollte disabled-Items nicht selektieren', () => {
      // Vorbedingungen testen
      const disabledCard = fixture.debugElement.queryAll(By.css('.lux-list-select-card'))[2];
      expect(disabledCard.nativeElement.classList).toContain('lux-disabled');

      // Änderungen durchführen
      disabledCard.nativeElement.click();
      listSelect.toggleItem(TEST_ITEMS[2]);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([]);
    });

    it('Sollte beim Wechsel von Multi auf Single die Selektion auf ein Item kappen und onChange melden', () => {
      // Vorbedingungen testen
      listSelect.toggleItem(TEST_ITEMS[0]);
      listSelect.toggleItem(TEST_ITEMS[1]);
      fixture.detectChanges();
      expect(host.selected.length).toBe(2);

      const changeSpy = jasmine.createSpy('onChange');
      listSelect.registerOnChange(changeSpy);

      // Änderungen durchführen
      host.mode = 'single';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[0]]);
      expect(changeSpy).toHaveBeenCalledWith([TEST_ITEMS[0]]);
    });
  });

  describe('Detail-Button', () => {
    it('Sollte den Detail-Button nur bei luxShowDetailButton anzeigen und das Item emittieren', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-list-select-detail button'))).toBeNull();

      // Änderungen durchführen
      host.showDetailButton = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const detailButtons = fixture.debugElement.queryAll(By.css('.lux-list-select-detail button'));
      expect(detailButtons.length).toBe(4);
      detailButtons[1].nativeElement.click();
      expect(host.lastDetail).toBe(TEST_ITEMS[1]);
    });
  });

  describe('List-Header', () => {
    it('Sollte den Zähler mit Gesamtanzahl anzeigen (luxTotalItems hat Vorrang)', () => {
      // Vorbedingungen testen
      const badge = fixture.debugElement.query(By.css('lux-badge'));
      expect(badge.nativeElement.textContent).toContain('0 von 4 ausgewählt');

      // Änderungen durchführen
      listSelect.toggleItem(TEST_ITEMS[0]);
      host.totalItems = 100;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(badge.nativeElement.textContent).toContain('1 von 100 ausgewählt');
    });

    it('Sollte die Alle-auswählen-Checkbox nur im Multi-Modus anzeigen', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-list-select-select-all'))).not.toBeNull();

      // Änderungen durchführen
      host.mode = 'single';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-list-select-select-all'))).toBeNull();
    });

    it('Sollte im Single-Modus keinen Zähler bzw. Header-Zeile anzeigen', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-list-select-header'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('lux-badge'))).not.toBeNull();

      // Änderungen durchführen
      host.mode = 'single';
      fixture.detectChanges();

      // Nachbedingungen prüfen: die Header-Zeile (und damit auch der Zähler) entfällt im Single-Modus komplett
      expect(fixture.debugElement.query(By.css('.lux-list-select-header'))).toBeNull();
      expect(fixture.debugElement.query(By.css('lux-badge'))).toBeNull();
    });

    it('Sollte über Alle-auswählen alle nicht-disabled Items selektieren und wieder abwählen', () => {
      // Änderungen durchführen
      listSelect.onSelectAllChange(true);
      fixture.detectChanges();

      // Nachbedingungen prüfen (TEST_ITEMS[2] ist disabled)
      expect(host.selected).toEqual([TEST_ITEMS[0], TEST_ITEMS[1], TEST_ITEMS[3]]);

      listSelect.onSelectAllChange(false);
      fixture.detectChanges();
      expect(host.selected).toEqual([]);
    });

    it('Sollte beim Alle-auswählen die Selektion anderer Seiten erhalten', () => {
      // Vorbedingungen testen: Item einer anderen Seite ist bereits selektiert
      host.selected = [OTHER_PAGE_ITEM];
      fixture.detectChanges();

      // Änderungen durchführen: aktuelle Seite komplett auswählen
      listSelect.onSelectAllChange(true);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Item der anderen Seite bleibt erhalten, Seiten-Items kommen hinzu
      expect(host.selected).toEqual([OTHER_PAGE_ITEM, TEST_ITEMS[0], TEST_ITEMS[1], TEST_ITEMS[3]]);

      // Änderungen durchführen: aktuelle Seite wieder abwählen
      listSelect.onSelectAllChange(false);
      fixture.detectChanges();

      // Nachbedingungen prüfen: nur die Seiten-Items werden entfernt, Item der anderen Seite bleibt erhalten
      expect(host.selected).toEqual([OTHER_PAGE_ITEM]);
    });

    it('Sollte bei Teilauswahl den Indeterminate-State setzen', () => {
      // Vorbedingungen testen
      const selectAll = () => fixture.debugElement.query(By.css('.lux-list-select-select-all input'));
      expect(selectAll().nativeElement.indeterminate).toBeFalse();

      // Änderungen durchführen
      listSelect.toggleItem(TEST_ITEMS[0]);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(selectAll().nativeElement.indeterminate).toBeTrue();

      listSelect.onSelectAllChange(true);
      fixture.detectChanges();
      expect(selectAll().nativeElement.indeterminate).toBeFalse();
      expect(selectAll().nativeElement.checked).toBeTrue();
    });
  });

  describe('List-Footer', () => {
    it('Sollte den Paginator nur bei luxShowPagination anzeigen, Seitenwechsel emittieren und die Liste dabei clientseitig slicen', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('lux-paginator'))).toBeNull();

      // Änderungen durchführen
      host.showPagination = true;
      host.pageSize = 2;
      fixture.detectChanges();

      // Nachbedingungen prüfen: Paginator sichtbar, erste Seite zeigt die ersten zwei Items
      expect(fixture.debugElement.query(By.css('lux-paginator'))).not.toBeNull();
      let cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Anna Müller');
      expect(cards[1].nativeElement.textContent).toContain('Thomas Schmidt');

      // Änderungen durchführen
      const nextButton = fixture.debugElement.query(By.css('lux-paginator .mat-mdc-paginator-navigation-next'));
      nextButton.nativeElement.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen: Seitenwechsel emittiert, zweite Seite zeigt die nächsten zwei Items
      expect(host.lastPageEvent?.pageIndex).toBe(1);
      expect(host.pageIndex).toBe(1);
      cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Laura Weber');
      expect(cards[1].nativeElement.textContent).toContain('Markus Fischer');
    });

    it('Sollte bei gleichzeitigem Paginator und Infinite Scroll einen Fehler loggen und die Paginierung nutzen', () => {
      // Vorbedingungen testen
      const errorSpy = spyOn(console, 'error');

      // Änderungen durchführen
      host.showPagination = true;
      host.infiniteScroll = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(errorSpy).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('lux-paginator'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.lux-list-select-viewport[luxinfinitescroll]'))).toBeNull();
    });

    it('Sollte luxMaxHeight als max-height am Container setzen und der Viewport schrumpfen', () => {
      // Vorbedingungen testen: ohne luxMaxHeight bestimmt der Inhalt die Höhe
      const container = fixture.debugElement.query(By.css('.lux-list-select-container'));
      expect(container.nativeElement.style.maxHeight).toBe('');
      const heightWithoutLimit = container.nativeElement.getBoundingClientRect().height;

      // Änderungen durchführen
      host.maxHeight = '120px';
      fixture.detectChanges();

      // Nachbedingungen prüfen: max-height sitzt am Container, nicht mehr am Viewport
      expect(container.nativeElement.style.maxHeight).toBe('120px');
      const viewport = fixture.debugElement.query(By.css('.lux-list-select-viewport'));
      expect(viewport.nativeElement.style.maxHeight).toBe('');
      expect(container.nativeElement.getBoundingClientRect().height).toBeLessThan(heightWithoutLimit);
    });

    it('Sollte die Infinite-Scroll-Direktive nur bei aktivem luxInfiniteScroll anwenden', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.directive(LuxInfiniteScrollDirective))).toBeNull();

      // Änderungen durchführen
      host.infiniteScroll = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.directive(LuxInfiniteScrollDirective))).not.toBeNull();
    });
  });

  describe('Suche', () => {
    function typeSearch(value: string) {
      const input = fixture.debugElement.query(By.css('.lux-list-select-search input')).nativeElement as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    it('Sollte das Suchfeld nur bei luxShowSearch anzeigen', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('.lux-list-select-search'))).toBeNull();

      // Änderungen durchführen
      host.showSearch = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-list-select-search'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.lux-list-select-search input'))).not.toBeNull();
    });

    it('Sollte nach Ablauf der Debounce case-insensitive über Titel und Untertitel filtern', fakeAsync(() => {
      // Vorbedingungen testen
      host.showSearch = true;
      fixture.detectChanges();

      // Änderungen durchführen: Großschreibung prüft die Case-Insensitivität, 'MÜLLER' passt nur auf den Titel von Anna Müller
      typeSearch('MÜLLER');
      tick(300);
      fixture.detectChanges();

      // Nachbedingungen prüfen: nur Anna Müller passt (case-insensitiv über den Titel)
      let cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(1);
      expect(cards[0].nativeElement.textContent).toContain('Anna Müller');
      const badge = fixture.debugElement.query(By.css('lux-badge'));
      expect(badge.nativeElement.textContent).toContain('0 von 1 ausgewählt');

      // Änderungen durchführen: 'münchen' passt nur über den Untertitel von Thomas Schmidt
      typeSearch('münchen');
      tick(300);
      fixture.detectChanges();

      // Nachbedingungen prüfen: nur Thomas Schmidt passt (case-insensitiv über den Untertitel)
      cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(1);
      expect(cards[0].nativeElement.textContent).toContain('Thomas Schmidt');
    }));

    it('Sollte bei aktiver Paginierung die gefilterte Liste selbst slicen und bei Suchänderung auf Seite 0 springen', fakeAsync(() => {
      // Vorbedingungen testen: Seite 1 (Index 1) ist aktiv, pageSize 2, keine Suche
      host.showSearch = true;
      host.showPagination = true;
      host.pageSize = 2;
      host.pageIndex = 1;
      fixture.detectChanges();
      let cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Laura Weber');
      expect(cards[1].nativeElement.textContent).toContain('Markus Fischer');

      // Änderungen durchführen: Suche nach 'er' (passt auf Anna Müller, Laura Weber, Markus Fischer)
      typeSearch('er');
      tick(300);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Seite auf 0 zurückgesprungen, gefilterte Liste selbst geslict
      expect(host.pageIndex).toBe(0);
      cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Anna Müller');
      expect(cards[1].nativeElement.textContent).toContain('Laura Weber');
    }));

    it('Sollte der Löschen-Button die Suche zurücksetzen', fakeAsync(() => {
      // Vorbedingungen testen
      host.showSearch = true;
      fixture.detectChanges();
      typeSearch('Anna');
      tick(300);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.lux-list-select-search-clear button'))).not.toBeNull();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(1);

      // Änderungen durchführen
      fixture.debugElement.query(By.css('.lux-list-select-search-clear button')).nativeElement.click();
      fixture.detectChanges();
      tick(300);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.searchValue).toBe('');
      expect(fixture.debugElement.query(By.css('.lux-list-select-search-clear button'))).toBeNull();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(4);
    }));

    it('Sollte das Suchfeld bei deaktivierter Komponente deaktivieren', fakeAsync(() => {
      // Vorbedingungen testen
      host.showSearch = true;
      fixture.detectChanges();
      typeSearch('Anna');
      tick(300);
      fixture.detectChanges();
      const searchInput = fixture.debugElement.query(By.css('.lux-list-select-search input')).nativeElement as HTMLInputElement;
      const clearButton = fixture.debugElement.query(By.css('.lux-list-select-search-clear button')).nativeElement as HTMLButtonElement;
      expect(searchInput.disabled).toBeFalse();
      expect(clearButton.disabled).toBeFalse();

      // Änderungen durchführen
      host.disabled = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(searchInput.disabled).toBeTrue();
      expect(clearButton.disabled).toBeTrue();
    }));

    it('Sollte bei vorbelegtem luxSearchValue den luxPageIndex nicht zurücksetzen', fakeAsync(() => {
      // Vorbedingungen testen: eigene Instanz, deren Suchwert und Seite bereits vor der ersten
      // Change-Detection vorbelegt sind (der gemeinsame Host aus beforeEach hat seine erste
      // Change-Detection mit leerem Suchwert schon hinter sich)
      const fixture2 = TestBed.createComponent(MockHostComponent);
      const host2 = fixture2.componentInstance;
      host2.showSearch = true;
      host2.showPagination = true;
      host2.searchValue = 'Anna';
      host2.pageIndex = 1;
      fixture2.detectChanges();
      tick(300);
      fixture2.detectChanges();

      // Nachbedingungen prüfen: der nachträglich feuernde vorbelegte Suchwert darf die Seite nicht zurücksetzen
      expect(host2.pageIndex).toBe(1);

      fixture2.destroy();
    }));
  });

  describe('Fehlerzustand', () => {
    it('Sollte bei luxErrorMessage eine gelbe Message-Box mit Warn-Icon anzeigen', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('lux-message-box'))).toBeNull();

      // Änderungen durchführen
      host.errorMessage = 'Bitte wähle eine Adresse aus, die du übernehmen möchtest.';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const messageBox = fixture.debugElement.query(By.css('lux-message-box'));
      expect(messageBox).not.toBeNull();
      expect(messageBox.nativeElement.textContent).toContain('Bitte wähle eine Adresse aus');

      // Änderungen durchführen
      host.errorMessage = null;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('lux-message-box'))).toBeNull();
    });

    describe('Message-Box bei luxMaxHeight', () => {
      // Die Karma-Testumgebung dieser Bibliothek lädt das kompilierte Theme-CSS nicht (der
      // esbuild-basierte @angular/build:karma-Builder verwirft die in karma.conf.js konfigurierten
      // "files" beim Zusammenführen mit den generierten Test-Bundles - ein von diesem Fix
      // unabhängiges Infrastruktur-Thema). Für einen echten Layout-Test werden hier exakt die
      // produktiven Regeln aus dem Theme-Partial (_luxListSelect.scss) und dem Utility-Katalog
      // (_luxlayout.scss) nachgebildet, die für das Container/Viewport-Schrumpfverhalten relevant sind.
      let styleEl: HTMLStyleElement;

      beforeEach(() => {
        styleEl = document.createElement('style');
        styleEl.textContent = `
          .lux-list-select-container { display: flex; flex-direction: column; }
          .lux-list-select-viewport { min-height: 0; }
          .lux-flex-auto { flex: 1 1 auto; }
          .lux-flex-shrink-0 { flex-shrink: 0; }
          lux-message-box { overflow: hidden; }
        `;
        document.head.appendChild(styleEl);
      });

      afterEach(() => {
        styleEl.remove();
      });

      it('Sollte die Message-Box bei luxMaxHeight nicht abschneiden', () => {
        // Vorbedingungen testen: Fehlermeldung ohne Höhenbegrenzung rendern, um den tatsächlichen
        // Platzbedarf von Header und Message-Box zu ermitteln (Pixelwerte hängen vom geladenen Theme
        // ab, daher keine hartkodierten Werte)
        host.errorMessage = 'Bitte wähle eine Adresse aus, die du übernehmen möchtest.';
        fixture.detectChanges();
        const header = fixture.debugElement.query(By.css('.lux-list-select-header')).nativeElement as HTMLElement;
        const messageBox = fixture.debugElement.query(By.css('.lux-list-select-error')).nativeElement as HTMLElement;
        const messageBoxNaturalHeight = messageBox.offsetHeight;
        expect(messageBoxNaturalHeight).toBeGreaterThan(0);

        // Änderungen durchführen: luxMaxHeight knapp über dem Platzbedarf von Header + Message-Box
        // setzen, sodass nur die Item-Liste im Viewport schrumpfen muss (keine aktive Paginierung)
        host.maxHeight = `${header.offsetHeight + messageBoxNaturalHeight + 40}px`;
        fixture.detectChanges();

        // Nachbedingungen prüfen: Message-Box behält ihre volle natürliche Höhe und liegt vollständig im Container
        const container = fixture.debugElement.query(By.css('.lux-list-select-container')).nativeElement as HTMLElement;
        expect(messageBox.offsetHeight).toBe(messageBoxNaturalHeight);
        expect(messageBox.clientHeight).not.toBeLessThan(messageBox.scrollHeight);

        const containerRect = container.getBoundingClientRect();
        const messageBoxRect = messageBox.getBoundingClientRect();
        expect(messageBoxRect.top).toBeGreaterThanOrEqual(containerRect.top);
        expect(messageBoxRect.bottom).toBeLessThanOrEqual(containerRect.bottom);
      });
    });
  });

  describe('DAO-Server-Modus', () => {
    function typeSearch(value: string) {
      const input = fixture.debugElement.query(By.css('.lux-list-select-search input')).nativeElement as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    it('Sollte im DAO-Modus beim Init Seite 0 laden und luxItems ignorieren', fakeAsync(() => {
      // Vorbedingungen testen
      const dao = new TestListSelectHttpDao();
      host.pageSize = 2;

      // Änderungen durchführen
      host.httpDao = dao;
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Seite 0 mit pageSize 2 geladen, luxItems (TEST_ITEMS) wird ignoriert
      expect(dao.loadDataSpy).toHaveBeenCalledWith({ page: 0, pageSize: 2, filter: '' });
      const cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Anna Müller');
      expect(cards[1].nativeElement.textContent).toContain('Thomas Schmidt');
    }));

    it('Sollte im DAO-Modus beim Seitenwechsel die neue Seite ersetzen', fakeAsync(() => {
      // Vorbedingungen testen
      const dao = new TestListSelectHttpDao();
      host.pageSize = 2;
      host.showPagination = true;
      host.httpDao = dao;
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Änderungen durchführen
      const nextButton = fixture.debugElement.query(By.css('lux-paginator .mat-mdc-paginator-navigation-next'));
      nextButton.nativeElement.click();
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Seite 1 ersetzt die Seite 0 (kein Append), und der Klick löst -
      // trotz des zusätzlichen luxPageIndex-Effects (Review-Finding) - genau EINEN Load aus statt
      // zweien (Init-Load auf Seite 0 + genau ein Load auf Seite 1)
      expect(dao.loadDataSpy).toHaveBeenCalledWith({ page: 1, pageSize: 2, filter: '' });
      expect(dao.loadDataSpy).toHaveBeenCalledTimes(2);
      const cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Laura Weber');
      expect(cards[1].nativeElement.textContent).toContain('Markus Fischer');
    }));

    it('Sollte im DAO-Modus bei programmatischer luxPageIndex-Änderung (nicht per Paginator-Klick) nachladen (Review-Finding)', fakeAsync(() => {
      // Vorbedingungen testen: initialer Load auf Seite 0 ist abgeschlossen
      const dao = new TestListSelectHttpDao();
      host.pageSize = 2;
      host.httpDao = dao;
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();
      dao.loadDataSpy.calls.reset();

      // Änderungen durchführen: luxPageIndex wird programmatisch vom Host gesetzt, nicht per Klick
      // auf den (hier gar nicht angezeigten) Paginator
      host.pageIndex = 1;
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: die neue Seite wird nachgeladen, und zwar genau einmal
      expect(dao.loadDataSpy).toHaveBeenCalledWith({ page: 1, pageSize: 2, filter: '' });
      expect(dao.loadDataSpy).toHaveBeenCalledTimes(1);
      const cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(2);
      expect(cards[0].nativeElement.textContent).toContain('Laura Weber');
      expect(cards[1].nativeElement.textContent).toContain('Markus Fischer');
    }));

    it('Sollte im DAO-Modus beim Infinite Scroll anhängen und bei vollständig geladener Menge keine weiteren Requests machen', fakeAsync(() => {
      // Vorbedingungen testen: 5 DAO-Items, pageSize 2 -> 3 Seiten (2, 2, 1)
      const dao = new TestListSelectHttpDao();
      host.pageSize = 2;
      host.infiniteScroll = true;
      host.httpDao = dao;
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(2);

      // Änderungen durchführen: erstes Scroll-Ende hängt Seite 1 an
      listSelect.onScrolled();
      tick(50);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(4);

      // Änderungen durchführen: zweites Scroll-Ende hängt die letzte Seite an, Menge ist danach vollständig geladen
      listSelect.onScrolled();
      tick(50);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(5);

      // Änderungen durchführen: weiteres Scroll-Ende darf keinen weiteren Request mehr auslösen
      listSelect.onScrolled();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(dao.loadDataSpy).toHaveBeenCalledTimes(3);
      expect(host.scrolledCount).toBe(3);
    }));

    it('Sollte im DAO-Modus bei Suchänderung mit Filter neu ab Seite 0 laden', fakeAsync(() => {
      // Vorbedingungen testen
      const dao = new TestListSelectHttpDao();
      host.pageSize = 2;
      host.showSearch = true;
      host.showPagination = true;
      host.pageIndex = 1;
      host.httpDao = dao;
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Änderungen durchführen
      typeSearch('mü');
      tick(300);
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Suche löst einen Reload ab Seite 0 mit dem Filter aus
      expect(dao.loadDataSpy).toHaveBeenCalledWith({ page: 0, pageSize: 2, filter: 'mü' });
      expect(host.pageIndex).toBe(0);
      const cards = fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
      expect(cards.length).toBe(1);
      expect(cards[0].nativeElement.textContent).toContain('Anna Müller');
    }));

    it('Sollte während des Ladens den Ladezustand setzen', fakeAsync(() => {
      // Vorbedingungen testen
      const dao = new TestListSelectHttpDao();
      host.pageSize = 2;
      host.infiniteScroll = true;

      // Änderungen durchführen
      host.httpDao = dao;
      fixture.detectChanges();

      // Nachbedingungen prüfen: während des laufenden Requests ist aria-busy gesetzt
      const viewport = fixture.debugElement.query(By.css('.lux-list-select-viewport'));
      expect(viewport.nativeElement.getAttribute('aria-busy')).toBe('true');
      expect(viewport.nativeElement.classList).toContain('lux-list-select-loading');

      // Änderungen durchführen: Request abschließen
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Ladezustand wird zurückgesetzt
      expect(viewport.nativeElement.getAttribute('aria-busy')).not.toBe('true');
      expect(viewport.nativeElement.classList).not.toContain('lux-list-select-loading');
    }));

    it('Sollte im DAO-Modus bei einem fehlschlagenden Load einen Fehler loggen, den Ladezustand zurücksetzen und beim nächsten Trigger wieder laden (Deferred-Finding #2)', fakeAsync(() => {
      // Vorbedingungen testen
      const dao = new FailingListSelectHttpDao();
      const consoleErrorSpy = spyOn(console, 'error');
      host.pageSize = 2;
      host.httpDao = dao;

      // Änderungen durchführen: der initiale Load schlägt fehl
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: Fehler wird geloggt, Ladezustand wird zurückgesetzt, Liste bleibt leer
      expect(consoleErrorSpy).toHaveBeenCalled();
      const viewport = fixture.debugElement.query(By.css('.lux-list-select-viewport'));
      expect(viewport.nativeElement.getAttribute('aria-busy')).not.toBe('true');
      expect(viewport.nativeElement.classList).not.toContain('lux-list-select-loading');
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(0);

      // Änderungen durchführen: der DAO liefert beim nächsten Trigger (Seitenwechsel) wieder
      // erfolgreich Daten - der Trigger-Stream muss den vorherigen Fehler überlebt haben
      dao.shouldFail = false;
      listSelect.onPageChange({ pageIndex: 1, pageSize: 2, length: 0 });
      fixture.detectChanges();
      tick(50);
      fixture.detectChanges();

      // Nachbedingungen prüfen: loadData wurde erneut gerufen und liefert nun Daten
      expect(dao.loadDataSpy).toHaveBeenCalledTimes(2);
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(2);
    }));

    it('Sollte im DAO-Modus mit vorbelegtem luxSearchValue genau einmal und mit Suchterm laden', fakeAsync(() => {
      // Vorbedingungen testen: eigene Instanz, deren Suchwert und DAO bereits vor der ersten
      // Change-Detection vorbelegt sind (der gemeinsame Host aus beforeEach hat seine erste
      // Change-Detection mit leerem Suchwert und ohne DAO schon hinter sich)
      const dao = new TestListSelectHttpDao();
      const fixture2 = TestBed.createComponent(MockHostComponent);
      const host2 = fixture2.componentInstance;
      host2.pageSize = 2;
      host2.showSearch = true;
      host2.searchValue = 'Anna';
      host2.httpDao = dao;

      // Änderungen durchführen
      fixture2.detectChanges();
      tick(300);
      fixture2.detectChanges();
      tick(50);
      fixture2.detectChanges();

      // Nachbedingungen prüfen: genau ein Load, direkt mit dem vorbelegten Suchterm
      expect(dao.loadDataSpy).toHaveBeenCalledTimes(1);
      expect(dao.loadDataSpy).toHaveBeenCalledWith(jasmine.objectContaining({ page: 0, filter: 'Anna' }));

      fixture2.destroy();
    }));
  });

  describe('ControlValueAccessor', () => {
    it('Sollte writeValue die Selektion setzen und null leeren', () => {
      // Änderungen durchführen
      listSelect.writeValue([TEST_ITEMS[1]]);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(listSelect.isSelected(TEST_ITEMS[1])).toBeTrue();

      listSelect.writeValue(null);
      fixture.detectChanges();
      expect(listSelect.luxSelected()).toEqual([]);
    });

    it('Sollte writeValue im Single-Modus auf ein Element kappen, ohne onChange zu rufen', () => {
      // Vorbedingungen testen
      host.mode = 'single';
      fixture.detectChanges();
      const changeSpy = jasmine.createSpy('onChange');
      listSelect.registerOnChange(changeSpy);

      // Änderungen durchführen
      listSelect.writeValue([TEST_ITEMS[0], TEST_ITEMS[1]]);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(listSelect.luxSelected()).toEqual([TEST_ITEMS[0]]);
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('Sollte Selektionsänderungen an registerOnChange melden', () => {
      // Vorbedingungen testen
      const changeSpy = jasmine.createSpy('onChange');
      listSelect.registerOnChange(changeSpy);

      // Änderungen durchführen
      listSelect.toggleItem(TEST_ITEMS[0]);

      // Nachbedingungen prüfen
      expect(changeSpy).toHaveBeenCalledWith([TEST_ITEMS[0]]);
    });

    it('Sollte setDisabledState die komplette Komponente deaktivieren', () => {
      // Änderungen durchführen
      listSelect.setDisabledState(true);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      listSelect.toggleItem(TEST_ITEMS[0]);
      expect(listSelect.luxSelected()).toEqual([]);
      const firstCard = fixture.debugElement.query(By.css('.lux-list-select-card'));
      expect(firstCard.nativeElement.classList).toContain('lux-disabled');
    });
  });

  describe('Grid-Tastaturnavigation', () => {
    function gridContainer(): HTMLElement {
      return fixture.debugElement.query(By.css('.lux-list-select-list')).nativeElement as HTMLElement;
    }

    function cards() {
      return fixture.debugElement.queryAll(By.css('.lux-list-select-card'));
    }

    it('Sollte die Liste als grid mit einem Tab-Stopp rendern und Items als row', () => {
      // Vorbedingungen testen
      host.showDetailButton = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen: Container ist der einzige Tab-Stopp des Grids
      const container = gridContainer();
      expect(container.getAttribute('role')).toBe('grid');
      expect(container.getAttribute('tabindex')).toBe('0');

      // Nachbedingungen prüfen: Karten sind rows ohne eigenen Tab-Stopp
      cards().forEach((card) => {
        expect(card.nativeElement.getAttribute('role')).toBe('row');
        expect(card.nativeElement.getAttribute('tabindex')).toBe('-1');
      });

      // Nachbedingungen prüfen: Checkboxen der Karten sind kein eigener Tab-Stopp mehr (die
      // "Alle auswählen"-Checkbox im Header ist bewusst ausgenommen, sie liegt außerhalb des Grids)
      fixture.debugElement.queryAll(By.css('.lux-list-select-card mat-checkbox')).forEach((checkbox) => {
        expect((checkbox.componentInstance as MatCheckbox).tabIndex).toBe(-1);
      });
      fixture.debugElement.queryAll(By.css('.lux-list-select-detail button')).forEach((button) => {
        expect(button.nativeElement.tabIndex).toBe(-1);
      });
    });

    it('Sollte im Single-Modus die Radio-Buttons ohne eigenen Tab-Stopp rendern', () => {
      // Änderungen durchführen
      host.mode = 'single';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const radios = fixture.debugElement.queryAll(By.css('.lux-list-select-card mat-radio-button'));
      expect(radios.length).toBe(4);
      radios.forEach((radio) => {
        expect(radio.nativeElement.querySelector('input')?.tabIndex).toBe(-1);
      });
    });

    it('Sollte beim Fokussieren des Containers das erste Item fokussieren und mit Pfeiltasten zwischen den Items navigieren', () => {
      // Änderungen durchführen: Container erhält den Fokus (z.B. via Tab von außen)
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();

      // Nachbedingungen prüfen: erstes Item ist fokussiert
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: ArrowDown navigiert zum nächsten Item
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(document.activeElement).toBe(cards()[1].nativeElement);

      // Änderungen durchführen: ArrowUp navigiert zurück
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', UP_ARROW);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(document.activeElement).toBe(cards()[0].nativeElement);
    });

    it('Sollte mit Home/End zum ersten und letzten Item navigieren', () => {
      // Änderungen durchführen
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', END);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(document.activeElement).toBe(cards()[3].nativeElement);

      // Änderungen durchführen
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', HOME);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(document.activeElement).toBe(cards()[0].nativeElement);
    });

    it('Sollte mit Space die Selektion des fokussierten Items toggeln', () => {
      // Änderungen durchführen
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', SPACE);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[0]]);

      // Änderungen durchführen: erneutes Space deselektiert wieder
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', SPACE);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([]);
    });

    it('Sollte mit F2 in den Detail-Button und mit Escape zurück auf die Karte wechseln', () => {
      // Vorbedingungen testen
      host.showDetailButton = true;
      fixture.detectChanges();
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();

      // Änderungen durchführen: F2 betritt den Edit-Modus und fokussiert den Detail-Button
      gridContainer().dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const detailButtons = fixture.debugElement.queryAll(By.css('.lux-list-select-detail button'));
      expect(document.activeElement).toBe(detailButtons[0].nativeElement);

      // Änderungen durchführen: Escape verlässt den Edit-Modus wieder
      LuxTestHelper.dispatchKeyboardEvent(detailButtons[0].nativeElement, 'keydown', ESCAPE);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(document.activeElement).toBe(cards()[0].nativeElement);
    });

    it('Sollte disabled-Items beim Fokussieren überspringen', () => {
      // Vorbedingungen testen: TEST_ITEMS[2] (Index 2) ist disabled
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: von Item 0 aus zweimal ArrowDown - Item 2 (disabled) wird übersprungen
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(document.activeElement).toBe(cards()[3].nativeElement);
    });

    it('Sollte nach einer Listenänderung nicht auf ein zerstörtes Item zeigen (Review-Finding)', fakeAsync(() => {
      // Vorbedingungen testen: Suche aktivieren, erstes Item (Anna Müller) fokussieren
      host.showSearch = true;
      fixture.detectChanges();
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: Suche filtert auf ein anderes Item - das fokussierte Item
      // (Anna Müller) verschwindet aus der Liste, seine Komponenteninstanz wird zerstört
      const input = fixture.debugElement.query(By.css('.lux-list-select-search input')).nativeElement as HTMLInputElement;
      input.value = 'Schmidt';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(300);
      fixture.detectChanges();
      expect(cards().length).toBe(1);

      // Änderungen durchführen: erneutes Fokussieren des Grids darf nicht auf die zerstörte
      // Instanz zugreifen (NG0951)
      expect(() => {
        LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
        fixture.detectChanges();
      }).not.toThrow();

      // Nachbedingungen prüfen: Fokus liegt auf dem ersten (einzigen) sichtbaren Item
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: Space darf nicht das alte, nicht mehr sichtbare Item (Anna
      // Müller) selektieren, sondern das jetzt aktive (Thomas Schmidt)
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', SPACE);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[1]]);
    }));

    it('Sollte Pfeiltasten und Space nutzen können, wenn im Edit-Modus der Fokus per Tab auf die Karte zurückkehrt (Review-Finding)', () => {
      // Vorbedingungen testen: Edit-Modus auf Item 0 betreten (Fokus auf Detail-Button)
      host.showDetailButton = true;
      fixture.detectChanges();
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      gridContainer().dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
      fixture.detectChanges();
      const detailButtons = fixture.debugElement.queryAll(By.css('.lux-list-select-detail button'));
      expect(document.activeElement).toBe(detailButtons[0].nativeElement);

      // Änderungen durchführen: Shift+Tab vom Detail-Button verlässt strukturell die Karte und
      // landet (da alle anderen Elemente tabindex=-1 sind) beim Grid-Container selbst - simuliert
      // durch ein natives focus-Event mit relatedTarget=Detail-Button (echte Tab-Traversierung
      // lässt sich per dispatchEvent nicht auslösen). onGridFocus springt daraufhin zur Karte
      // zurück, der Edit-Modus bleibt (strukturell) aktiv.
      const focusEvent = new FocusEvent('focus', { relatedTarget: detailButtons[0].nativeElement });
      gridContainer().dispatchEvent(focusEvent);
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: ArrowDown muss trotz (strukturell) aktivem Edit-Modus zum
      // nächsten Item navigieren. Dispatch als natives KeyboardEvent auf der Karte (nicht dem
      // Container, und nicht über LuxTestHelper.dispatchKeyboardEvent - dessen target-Property
      // ist fest auf den optionalen 4. Parameter gebunden): im echten Browser bubbelt das Event
      // vom tatsächlich fokussierten Element (der Karte) nach oben, event.target ist daher die
      // Karte, was die focusIsOnRow-Prüfung im Edit-Modus benötigt.
      cards()[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[1].nativeElement);

      // Änderungen durchführen: Space muss das jetzt aktive Item (Index 1) toggeln
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', SPACE);
      fixture.detectChanges();
      expect(host.selected).toEqual([TEST_ITEMS[1]]);
    });

    it('Sollte im Normal-Modus beim Fokus-Rücksprung aus dem Grid selbst nichts tun (Shift+Tab-Falle, Review-Finding)', () => {
      // Vorbedingungen testen: erstes Item ist fokussiert (Container-Fokus von außen)
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: der Fokus "kehrt" vom aktiven Item auf den Grid-Container zurück
      // (z.B. Shift+Tab von der Karte, deren tabindex=-1 sie aus dem normalen Tab-Fluss nimmt und
      // den Container als nächsten rückwärtigen Tab-Stopp übrig lässt) - simuliert durch ein
      // natives focus-Event mit relatedTarget=Karte, außerhalb des Edit-Modus.
      const focusSpy = spyOn(cards()[0].nativeElement, 'focus').and.callThrough();
      const focusEvent = new FocusEvent('focus', { relatedTarget: cards()[0].nativeElement });
      gridContainer().dispatchEvent(focusEvent);
      fixture.detectChanges();

      // Nachbedingungen prüfen: der Fokus wird NICHT auf die Karte zurückgeworfen - sonst würde
      // Shift+Tab in einer Endlosschleife zwischen Karte und Container hängen bleiben und das Grid
      // wäre rückwärts nicht mehr verlassbar. Der Fokus bleibt auf dem Container, der nächste
      // Shift+Tab verlässt das Grid regulär.
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('Sollte einen Klick auf ein disabled-Item nicht als aktives Item im FocusKeyManager übernehmen (Review-Finding)', () => {
      // Vorbedingungen testen: Item 0 fokussieren
      LuxTestHelper.dispatchFakeEvent(gridContainer(), 'focus', true);
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[0].nativeElement);

      // Änderungen durchführen: Klick auf das disabled Item (Index 2) darf es nicht als aktives
      // Item im FocusKeyManager übernehmen
      cards()[2].nativeElement.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen: ArrowDown navigiert weiterhin von Item 0 aus zu Item 1 - nicht
      // vom (fälschlich aktivierten) disabled Item 2 aus zu Item 3
      LuxTestHelper.dispatchKeyboardEvent(gridContainer(), 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      expect(document.activeElement).toBe(cards()[1].nativeElement);
    });

    it('Sollte im Single-Modus jeder Instanz einen eindeutigen Radio-Group-Namen zuweisen (Review-Finding: UniqueSelectionDispatcher)', () => {
      // Vorbedingungen testen: zweite, unabhängige Instanz erzeugen
      host.mode = 'single';
      fixture.detectChanges();
      const fixture2 = TestBed.createComponent(MockHostComponent);
      fixture2.componentInstance.mode = 'single';
      fixture2.detectChanges();

      // Nachbedingungen prüfen: beide Instanzen vergeben ein name-Attribut, aber unterschiedliche
      // (sonst löschen sich namenlose Standalone-Radios instanzübergreifend die Checked-Optik)
      const nameA = (fixture.debugElement.query(By.css('.lux-list-select-card mat-radio-button input')).nativeElement as HTMLInputElement)
        .name;
      const nameB = (
        fixture2.debugElement.query(By.css('.lux-list-select-card mat-radio-button input')).nativeElement as HTMLInputElement
      ).name;
      expect(nameA).toBeTruthy();
      expect(nameB).toBeTruthy();
      expect(nameA).not.toBe(nameB);

      fixture2.destroy();
    });

    it('Sollte interaktive Elemente aus luxContentTemplate in die Tab-Stopp-Verwaltung und den Tab-Zyklus einbeziehen (Review-Finding)', fakeAsync(() => {
      // Vorbedingungen testen: eigene Host-Komponente mit interaktivem Link im luxContentTemplate
      const fixtureCT = TestBed.createComponent(MockHostWithContentTemplateComponent);
      fixtureCT.detectChanges();
      tick();
      const container = fixtureCT.debugElement.query(By.css('.lux-list-select-list')).nativeElement as HTMLElement;
      const link = fixtureCT.debugElement.query(By.css('.mock-content-link')).nativeElement as HTMLElement;
      const detailButton = fixtureCT.debugElement.query(By.css('.lux-list-select-detail button')).nativeElement as HTMLElement;
      const card = fixtureCT.debugElement.query(By.css('.lux-list-select-card')).nativeElement as HTMLElement;
      expect(link.tabIndex).toBe(-1);

      // Änderungen durchführen: Grid fokussieren, F2 betritt den Edit-Modus
      LuxTestHelper.dispatchFakeEvent(container, 'focus', true);
      fixtureCT.detectChanges();
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
      fixtureCT.detectChanges();
      tick();

      // Nachbedingungen prüfen: im Edit-Modus sind beide inneren Elemente reguläre Tab-Stopps -
      // der Browser regelt die Reihenfolge zwischen ihnen selbst; der Fokus landet auf dem
      // ersten inneren Element (Link, da er in der Kartenreihenfolge vor dem Detail-Button liegt)
      expect(link.tabIndex).toBe(0);
      expect(detailButton.tabIndex).toBe(0);
      expect(document.activeElement).toBe(link);

      // Änderungen durchführen: Tab vom letzten fokussierbaren Element (Detail-Button) springt
      // zurück zur Karte (Tab-Zyklus-Grenze berücksichtigt jetzt auch den projizierten Link)
      detailButton.focus();
      detailButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
      fixtureCT.detectChanges();
      expect(document.activeElement).toBe(card);

      // Änderungen durchführen: F2 verlässt den Edit-Modus wieder
      card.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
      fixtureCT.detectChanges();
      tick();

      // Nachbedingungen prüfen: außerhalb des Edit-Modus ist der Link wieder kein Tab-Stopp
      expect(link.tabIndex).toBe(-1);

      fixtureCT.destroy();
    }));
  });

  describe('A11y', () => {
    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    it('Sollte im Multi-Modus keine Barrierefreiheitsverletzungen haben', async () => {
      host.mode = 'multi';
      host.showPagination = true;
      host.errorMessage = 'Bitte eine Auswahl treffen.';
      host.showDetailButton = true;
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Sollte im Single-Modus keine Barrierefreiheitsverletzungen haben', async () => {
      host.mode = 'single';
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  selector: 'lux-mock-host',
  imports: [LuxListSelectComponent],
  template: `
    <lux-list-select
      [luxMode]="mode"
      [luxItems]="items"
      [(luxSelected)]="selected"
      [luxShowDetailButton]="showDetailButton"
      [luxTotalItems]="totalItems"
      [luxShowPagination]="showPagination"
      [luxPageSize]="pageSize"
      [luxInfiniteScroll]="infiniteScroll"
      [luxMaxHeight]="maxHeight"
      [(luxPageIndex)]="pageIndex"
      [luxErrorMessage]="errorMessage"
      [luxDisabled]="disabled"
      [luxShowSearch]="showSearch"
      [(luxSearchValue)]="searchValue"
      [luxHttpDao]="httpDao"
      (luxPageChange)="lastPageEvent = $event"
      (luxDetailClicked)="lastDetail = $event"
      (luxScrolled)="scrolledCount = scrolledCount + 1"
    />
  `
})
class MockHostComponent {
  mode: LuxListSelectMode = 'multi';
  items = TEST_ITEMS;
  selected: TestAdresse[] = [];
  showDetailButton = false;
  lastDetail: TestAdresse | null = null;
  totalItems: number | null = null;
  showPagination = false;
  pageSize = 5;
  infiniteScroll = false;
  maxHeight: string | null = null;
  pageIndex = 0;
  lastPageEvent: LuxPageEvent | null = null;
  errorMessage: string | null = null;
  disabled = false;
  showSearch = false;
  searchValue = '';
  httpDao: ILuxListSelectHttpDao<TestAdresse> | undefined = undefined;
  scrolledCount = 0;
}

@Component({
  selector: 'lux-mock-host-content-template',
  imports: [LuxListSelectComponent],
  template: `
    <lux-list-select [luxMode]="'multi'" [luxItems]="items" [(luxSelected)]="selected" [luxShowDetailButton]="true">
      <ng-template let-item>
        <a href="#" class="mock-content-link">{{ item.label }}</a>
      </ng-template>
    </lux-list-select>
  `
})
class MockHostWithContentTemplateComponent {
  items = TEST_ITEMS;
  selected: TestAdresse[] = [];
}
