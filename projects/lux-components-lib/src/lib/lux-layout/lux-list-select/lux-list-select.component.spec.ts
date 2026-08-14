import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxPageEvent } from '@ihk-gfi/lux-components/lux-paginator';
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

    it('Sollte beim Wechsel von Multi auf Single die Selektion auf ein Item kappen', () => {
      // Vorbedingungen testen
      listSelect.toggleItem(TEST_ITEMS[0]);
      listSelect.toggleItem(TEST_ITEMS[1]);
      fixture.detectChanges();
      expect(host.selected.length).toBe(2);

      // Änderungen durchführen
      host.mode = 'single';
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(host.selected).toEqual([TEST_ITEMS[0]]);
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
    it('Sollte den Paginator nur bei luxShowPagination anzeigen und Seitenwechsel emittieren', () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('lux-paginator'))).toBeNull();

      // Änderungen durchführen
      host.showPagination = true;
      host.totalItems = 100;
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('lux-paginator'))).not.toBeNull();
      const nextButton = fixture.debugElement.query(By.css('lux-paginator .mat-mdc-paginator-navigation-next'));
      nextButton.nativeElement.click();
      fixture.detectChanges();
      expect(host.lastPageEvent?.pageIndex).toBe(1);
      expect(host.pageIndex).toBe(1);
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
      [luxInfiniteScroll]="infiniteScroll"
      [luxMaxHeight]="maxHeight"
      [(luxPageIndex)]="pageIndex"
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
  infiniteScroll = false;
  maxHeight: string | null = null;
  pageIndex = 0;
  lastPageEvent: LuxPageEvent | null = null;
}
