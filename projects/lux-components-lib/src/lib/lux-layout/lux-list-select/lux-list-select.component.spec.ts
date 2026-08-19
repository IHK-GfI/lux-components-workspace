import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxPageEvent } from '@ihk-gfi/lux-components/lux-paginator';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxListSelectComponent } from './lux-list-select.component';
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
      expect(fixture.debugElement.query(By.css('.lux-list-select-detail'))).toBeNull();

      // Änderungen durchführen
      host.showDetailButton = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const detailButtons = fixture.debugElement.queryAll(By.css('.lux-list-select-detail'));
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

    it('Sollte luxMaxHeight als max-height am Viewport setzen', () => {
      // Änderungen durchführen
      host.maxHeight = '400px';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const viewport = fixture.debugElement.query(By.css('.lux-list-select-viewport'));
      expect(viewport.nativeElement.style.maxHeight).toBe('400px');
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
      const input = fixture.debugElement.query(By.css('.lux-list-select-search-input')).nativeElement as HTMLInputElement;
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
      expect(fixture.debugElement.query(By.css('.lux-list-select-search-input'))).not.toBeNull();
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
      expect(fixture.debugElement.query(By.css('.lux-list-select-search-clear'))).not.toBeNull();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(1);

      // Änderungen durchführen
      fixture.debugElement.query(By.css('.lux-list-select-search-clear')).nativeElement.click();
      fixture.detectChanges();
      tick(300);
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.searchValue).toBe('');
      expect(fixture.debugElement.query(By.css('.lux-list-select-search-clear'))).toBeNull();
      expect(fixture.debugElement.queryAll(By.css('.lux-list-select-card')).length).toBe(4);
    }));

    it('Sollte das Suchfeld bei deaktivierter Komponente deaktivieren', fakeAsync(() => {
      // Vorbedingungen testen
      host.showSearch = true;
      fixture.detectChanges();
      typeSearch('Anna');
      tick(300);
      fixture.detectChanges();
      const searchInput = fixture.debugElement.query(By.css('.lux-list-select-search-input')).nativeElement as HTMLInputElement;
      const clearButton = fixture.debugElement.query(By.css('.lux-list-select-search-clear')).nativeElement as HTMLButtonElement;
      expect(searchInput.disabled).toBeFalse();
      expect(clearButton.disabled).toBeFalse();

      // Änderungen durchführen
      host.disabled = true;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(searchInput.disabled).toBeTrue();
      expect(clearButton.disabled).toBeTrue();
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
      (luxPageChange)="lastPageEvent = $event"
      (luxDetailClicked)="lastDetail = $event"
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
}
