import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
// noinspection DuplicatedCode

import { DOWN_ARROW, END, ENTER, ESCAPE, HOME, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxListItemContentComponent } from './lux-list-subcomponents/lux-list-item-content.component';
import { LuxListItemIconComponent } from './lux-list-subcomponents/lux-list-item-icon.component';
import { LuxListItemComponent } from './lux-list-subcomponents/lux-list-item.component';
import { LuxListComponent } from './lux-list.component';

describe('LuxListComponent', () => {
  let testComponent: MockListComponent;
  let fixture: ComponentFixture<MockListComponent>;
  let listComponent: LuxListComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockListComponent);
    testComponent = fixture.componentInstance;
    listComponent = fixture.debugElement.query(By.directive(LuxListComponent)).componentInstance;

    fixture.detectChanges();
  });

  it('Sollte erstellt werden', () => {
    fixture.detectChanges();
    expect(testComponent).toBeTruthy();
  });

  it('Sollte Empty-Icon und Empty-Label anzeigen (leere Liste)', async () => {
    expect(fixture.debugElement.query(By.css('lux-icon.lux-list-empty-icon'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('span.lux-list-empty-icon-text'))).not.toBeNull();
  });

  it('Sollte LuxListItems anzeigen (gefüllte Liste)', async () => {
    // Vorbedingungen testen
    expect(fixture.debugElement.query(By.css('lux-icon.lux-list-empty-icon'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('span.lux-list-empty-icon-text'))).not.toBeNull();
    expect(fixture.debugElement.queryAll(By.directive(LuxListItemComponent)).length).toBe(0);

    // Änderungen durchführen
    testComponent.addListItems(5);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(fixture.debugElement.query(By.css('lux-icon.lux-list-empty-icon'))).toBeNull();
    expect(fixture.debugElement.query(By.css('span.lux-list-empty-label'))).toBeNull();
    expect(fixture.debugElement.queryAll(By.directive(LuxListItemComponent)).length).toBe(5);
    expect(fixture.debugElement.query(By.css('.lux-card-title')).nativeElement.textContent.trim()).toEqual('Title 0');
    expect(fixture.debugElement.query(By.css('.lux-card-subtitle')).nativeElement.textContent.trim()).toEqual('SubTitle 0');
  });

  it('Sollte ein selektiertes LuxListItem haben (max. 1, via LuxListItem)', async () => {
    // Vorbedingungen testen
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.directive(LuxListItemComponent));
    (listItems[0].componentInstance as LuxListItemComponent).luxSelected.set(true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 0'
    );

    // Änderungen durchführen
    (listItems[0].componentInstance as LuxListItemComponent).luxSelected.set(false);
    fixture.detectChanges();
    (listItems[1].componentInstance as LuxListItemComponent).luxSelected.set(true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 1'
    );
  });

  it('Sollte ein selektiertes LuxListItem haben (max. 1, via LuxList)', async () => {
    // Vorbedingungen testen
    const selectedSpy = vi.spyOn(testComponent, 'onSelected').mockReturnValue(undefined);
    const focusedSpy = vi.spyOn(testComponent, 'onFocused').mockReturnValue(undefined);
    const focusedItemSpy = vi.spyOn(testComponent, 'onFocusedItem').mockReturnValue(undefined);

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    fixture.detectChanges();
    testComponent.selectedPosition.set(0);
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.directive(LuxListItemComponent));

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(1);
    expect(selectedSpy).toHaveBeenCalledWith(0);
    expect(focusedSpy).toHaveBeenCalledTimes(1);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(1);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 0'
    );

    // Änderungen durchführen
    testComponent.selectedPosition.set(1);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(2);
    expect(selectedSpy).toHaveBeenCalledWith(1);
    expect(focusedSpy).toHaveBeenCalledTimes(2);
    expect(focusedSpy).toHaveBeenCalledWith(1);
    expect(focusedItemSpy).toHaveBeenCalledTimes(2);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[1].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 1'
    );
  });

  it('Sollte über die Pfeiltasten LuxListItems fokussieren können', async () => {
    // Vorbedingungen testen
    const selectedSpy = vi.spyOn(testComponent, 'onSelected').mockReturnValue(undefined);
    const focusedSpy = vi.spyOn(testComponent, 'onFocused').mockReturnValue(undefined);
    const focusedItemSpy = vi.spyOn(testComponent, 'onFocusedItem').mockReturnValue(undefined);

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.directive(LuxListItemComponent));
    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(1);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(1);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);

    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(2);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(2);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);

    // Änderungen durchführen
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    // // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(3);
    expect(focusedSpy).toHaveBeenCalledWith(1);
    expect(focusedItemSpy).toHaveBeenCalledTimes(3);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[1].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);

    // Änderungen durchführen
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', UP_ARROW);
    fixture.detectChanges();

    // // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(4);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(4);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);
  });

  it('Sollte über die F2-Taste ein LuxListItem selektieren können', async () => {
    // Vorbedingungen testen
    const selectedSpy = vi.spyOn(testComponent, 'onSelected').mockReturnValue(undefined);

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    fixture.detectChanges();

    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
    fixture.detectChanges();
    listNativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(1);
    expect(selectedSpy).toHaveBeenCalledWith(0);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
  });

  it('Sollte bei leerer Liste keinen Fehler werfen wenn Space/Enter gedrückt wird', async () => {
    // Liste bleibt leer – kein addListItems()
    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    expect(() => {
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', SPACE);
    }).not.toThrow();
    fixture.detectChanges();
  });

  it('Sollte über die Pfeiltasten + Space/Enter ein LuxListItem selektieren können', async () => {
    // Vorbedingungen testen
    const selectedSpy = vi.spyOn(testComponent, 'onSelected').mockReturnValue(undefined);
    const focusedSpy = vi.spyOn(testComponent, 'onFocused').mockReturnValue(undefined);
    const focusedItemSpy = vi.spyOn(testComponent, 'onFocusedItem').mockReturnValue(undefined);

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.directive(LuxListItemComponent));
    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
    fixture.detectChanges();
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', SPACE);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(1);
    expect(selectedSpy).toHaveBeenCalledWith(0);
    expect(focusedSpy).toHaveBeenCalledTimes(1);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(1);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 0'
    );

    // Änderungen durchführen
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ENTER);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(2);
    expect(selectedSpy).toHaveBeenCalledWith(1);
    expect(focusedSpy).toHaveBeenCalledTimes(2);
    expect(focusedSpy).toHaveBeenCalledWith(1);
    expect(focusedItemSpy).toHaveBeenCalledTimes(2);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[1].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 1'
    );
  });

  describe('Edit-Modus (Grid-Navigation)', () => {
    let fixtureI: ComponentFixture<MockListWithInteractiveComponent>;
    let testI: MockListWithInteractiveComponent;

    beforeEach(() => {
      fixtureI = TestBed.createComponent(MockListWithInteractiveComponent);
      testI = fixtureI.componentInstance;
      fixtureI.detectChanges();
    });

    afterEach(() => {
      fixtureI.destroy();
    });

    it('Sollte interaktive Elemente initial tabindex="-1" haben', async () => {
      // Änderungen durchführen
      testI.addListItems(3);
      fixtureI.detectChanges();

      // Nachbedingungen prüfen
      const buttons = fixtureI.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(-1);
      });
    });

    it('Sollte bei Enter den Edit-Modus aktivieren und Buttons im aktiven Item tabindex="0" setzen', async () => {
      // Änderungen durchführen
      testI.addListItems(3);
      fixtureI.detectChanges();

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ENTER);
      fixtureI.detectChanges();

      // Nachbedingungen prüfen: aktives Item (Index 0) hat tabIndex=0
      const listItems = fixtureI.debugElement.queryAll(By.directive(LuxListItemComponent));
      listItems[0].queryAll(By.css('button')).forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(0);
      });
      // Alle anderen Items haben tabIndex=-1
      listItems[1].queryAll(By.css('button')).forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(-1);
      });
    });

    it('Sollte bei Space den Edit-Modus aktivieren', async () => {
      // Änderungen durchführen
      testI.addListItems(3);
      fixtureI.detectChanges();

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', SPACE);
      fixtureI.detectChanges();

      // Nachbedingungen prüfen
      fixtureI.debugElement
        .queryAll(By.directive(LuxListItemComponent))[0]
        .queryAll(By.css('button'))
        .forEach((btn) => {
          expect(btn.nativeElement.tabIndex).toBe(0);
        });
    });

    it('Sollte bei Escape den Edit-Modus beenden und tabindex="-1" wiederherstellen', async () => {
      // Änderungen durchführen
      testI.addListItems(3);
      fixtureI.detectChanges();

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();

      // Edit-Modus aktivieren
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ENTER);
      fixtureI.detectChanges();

      // Vorbedingung: Buttons im aktiven Item haben tabIndex=0
      fixtureI.debugElement
        .queryAll(By.directive(LuxListItemComponent))[0]
        .queryAll(By.css('button'))
        .forEach((btn) => {
          expect(btn.nativeElement.tabIndex).toBe(0);
        });

      // Edit-Modus beenden via Escape
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ESCAPE);
      fixtureI.detectChanges();

      // Nachbedingungen prüfen: alle Buttons haben wieder tabIndex=-1
      fixtureI.debugElement.queryAll(By.css('button')).forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(-1);
      });
    });

    it('Sollte mit ArrowDown im Normal-Modus zur nächsten Zeile navigieren', async () => {
      // Vorbedingungen testen
      const focusedSpy = vi.spyOn(testI, 'onFocused').mockReturnValue(undefined);

      // Änderungen durchführen
      testI.addListItems(3);
      fixtureI.detectChanges();

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
      fixtureI.detectChanges();

      // Nachbedingungen prüfen
      expect(focusedSpy).toHaveBeenCalledWith(1);
    });

    it('Sollte mit Home/End zur ersten und letzten Zeile navigieren', async () => {
      // Vorbedingungen testen
      const focusedSpy = vi.spyOn(testI, 'onFocused').mockReturnValue(undefined);

      // Änderungen durchführen
      testI.addListItems(5);
      fixtureI.detectChanges();

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();

      // Zur Mitte navigieren
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
      fixtureI.detectChanges();

      // Home → ersten Eintrag
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', HOME);
      fixtureI.detectChanges();
      expect(focusedSpy).toHaveBeenCalledWith(0);

      // End → letzten Eintrag
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', END);
      fixtureI.detectChanges();
      expect(focusedSpy).toHaveBeenCalledWith(4);
    });

    it('Sollte role="grid" auf lux-list und role="row" auf lux-list-item setzen', async () => {
      // Änderungen durchführen
      testI.addListItems(2);
      fixtureI.detectChanges();

      // Nachbedingungen prüfen
      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      expect(listNativeElement.getAttribute('role')).toBe('grid');

      fixtureI.debugElement.queryAll(By.directive(LuxListItemComponent)).forEach((item) => {
        expect(item.nativeElement.getAttribute('role')).toBe('row');
      });
    });
  });
});

@Component({
  selector: 'lux-mock-list',
  template: `
    <lux-list
      luxLabel="Testliste"
      luxEmptyLabel="Empty-Label"
      luxEmptyIconName="lux-interface-delete-1"
      luxEmptyIconSize="5x"
      [luxSelectedPosition]="selectedPosition()"
      (luxSelectedPositionChange)="onSelected($event)"
      (luxFocusedPositionChange)="onFocused($event)"
      (luxFocusedItemChange)="onFocusedItem($event)"
    >
      @for (item of list(); track item.title; let i = $index) {
        <lux-list-item [luxTitle]="item.title" [luxSubTitle]="item.subTitle" [luxSelected]="item.selected">
          <lux-list-item-icon>
            <lux-icon luxIconName="lux-interface-user-single" />
          </lux-list-item-icon>
          <lux-list-item-content> Item-Content #{{ i }} </lux-list-item-content>
        </lux-list-item>
      }
    </lux-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxListComponent, LuxListItemComponent, LuxListItemContentComponent, LuxListItemIconComponent, LuxIconComponent]
})
class MockListComponent {
  selectedPosition = signal<number | undefined>(undefined);

  list = signal<
    {
      title: string;
      subTitle: string;
      selected: boolean;
    }[]
  >([]);

  onSelected(event: number) {}

  onFocused(event: number) {}

  onFocusedItem(event: LuxListItemComponent) {}

  addListItems(amount: number) {
    const newItems: {
      title: string;
      subTitle: string;
      selected: boolean;
    }[] = [];
    for (let i = 0; i < amount; i++) {
      newItems.push({
        title: 'Title ' + i,
        subTitle: 'SubTitle ' + i,
        selected: false
      });
    }
    this.list.update((current) => [...current, ...newItems]);
  }
}

@Component({
  selector: 'lux-mock-list-interactive',
  template: `
    <lux-list
      luxLabel="Testliste"
      [luxSelectedPosition]="selectedPosition()"
      (luxSelectedPositionChange)="onSelected($event)"
      (luxFocusedPositionChange)="onFocused($event)"
    >
      @for (item of list(); track item.title) {
        <lux-list-item [luxTitle]="item.title">
          <lux-list-item-content>
            <button type="button" class="btn-a">Button A</button>
            <button type="button" class="btn-b">Button B</button>
          </lux-list-item-content>
        </lux-list-item>
      }
    </lux-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxListComponent, LuxListItemComponent, LuxListItemContentComponent]
})
class MockListWithInteractiveComponent {
  selectedPosition = signal<number | undefined>(undefined);
  list = signal<
    {
      title: string;
    }[]
  >([]);

  onSelected(event: number) {}

  onFocused(event: number) {}

  addListItems(amount: number) {
    const newItems: {
      title: string;
    }[] = [];
    for (let i = 0; i < amount; i++) {
      newItems.push({ title: 'Title ' + i });
    }
    this.list.update((current) => [...current, ...newItems]);
  }
}
