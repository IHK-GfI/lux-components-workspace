// noinspection DuplicatedCode

import { DOWN_ARROW, END, ENTER, ESCAPE, HOME, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxListItemContentComponent } from './lux-list-subcomponents/lux-list-item-content.component';
import { LuxListItemIconComponent } from './lux-list-subcomponents/lux-list-item-icon.component';
import { LuxListItemComponent } from './lux-list-subcomponents/lux-list-item.component';
import { LuxListComponent } from './lux-list.component';

describe('LuxListComponent', () => {
  let testComponent: MockListComponent;
  let fixture: ComponentFixture<MockListComponent>;
  let listComponent: LuxListComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
  }));

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

  it('Sollte Empty-Icon und Empty-Label anzeigen (leere Liste)', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css('lux-icon.lux-list-empty-icon'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('span.lux-list-empty-icon-text'))).not.toBeNull();
  }));

  it('Sollte LuxListItems anzeigen (gefüllte Liste)', fakeAsync(() => {
    // Vorbedingungen testen
    expect(fixture.debugElement.query(By.css('lux-icon.lux-list-empty-icon'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('span.lux-list-empty-icon-text'))).not.toBeNull();
    expect(fixture.debugElement.queryAll(By.directive(LuxListItemComponent)).length).toBe(0);

    // Änderungen durchführen
    testComponent.addListItems(5);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(fixture.debugElement.query(By.css('lux-icon.lux-list-empty-icon'))).toBeNull();
    expect(fixture.debugElement.query(By.css('span.lux-list-empty-label'))).toBeNull();
    expect(fixture.debugElement.queryAll(By.directive(LuxListItemComponent)).length).toBe(5);
    expect(fixture.debugElement.query(By.css('.lux-card-title')).nativeElement.textContent.trim()).toEqual('Title 0');
    expect(fixture.debugElement.query(By.css('.lux-card-subtitle')).nativeElement.textContent.trim()).toEqual('SubTitle 0');
  }));

  it('Sollte ein selektiertes LuxListItem haben (max. 1, via LuxListItem)', fakeAsync(() => {
    // Vorbedingungen testen
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    LuxTestHelper.wait(fixture);

    const listItems = fixture.debugElement.queryAll(By.directive(LuxListItemComponent));
    (listItems[0].componentInstance as LuxListItemComponent).luxSelected = true;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 0'
    );

    // Änderungen durchführen
    (listItems[0].componentInstance as LuxListItemComponent).luxSelected = false;
    LuxTestHelper.wait(fixture);
    (listItems[1].componentInstance as LuxListItemComponent).luxSelected = true;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.lux-list-item-selected .lux-card-title')).nativeElement.textContent.trim()).toEqual(
      'Title 1'
    );
  }));

  it('Sollte ein selektiertes LuxListItem haben (max. 1, via LuxList)', fakeAsync(() => {
    // Vorbedingungen testen
    const selectedSpy = spyOn(testComponent, 'onSelected');
    const focusedSpy = spyOn(testComponent, 'onFocused');
    const focusedItemSpy = spyOn(testComponent, 'onFocusedItem');

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    LuxTestHelper.wait(fixture);
    testComponent.selectedPosition = 0;
    LuxTestHelper.wait(fixture);
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
    testComponent.selectedPosition = 1;
    LuxTestHelper.wait(fixture);

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
  }));

  it('Sollte über die Pfeiltasten LuxListItems fokussieren können', fakeAsync(() => {
    // Vorbedingungen testen
    const selectedSpy = spyOn(testComponent, 'onSelected');
    const focusedSpy = spyOn(testComponent, 'onFocused');
    const focusedItemSpy = spyOn(testComponent, 'onFocusedItem');

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    LuxTestHelper.wait(fixture);

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
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(2);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(2);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);

    // Änderungen durchführen
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
    LuxTestHelper.wait(fixture);

    // // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(3);
    expect(focusedSpy).toHaveBeenCalledWith(1);
    expect(focusedItemSpy).toHaveBeenCalledTimes(3);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[1].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);

    // Änderungen durchführen
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', UP_ARROW);
    LuxTestHelper.wait(fixture);

    // // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(0);
    expect(focusedSpy).toHaveBeenCalledTimes(4);
    expect(focusedSpy).toHaveBeenCalledWith(0);
    expect(focusedItemSpy).toHaveBeenCalledTimes(4);
    expect(focusedItemSpy).toHaveBeenCalledWith(listItems[0].componentInstance as LuxListItemComponent);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(0);
  }));

  it('Sollte über die F2-Taste ein LuxListItem selektieren können', fakeAsync(() => {
    // Vorbedingungen testen
    const selectedSpy = spyOn(testComponent, 'onSelected');

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    LuxTestHelper.wait(fixture);

    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
    fixture.detectChanges();
    listNativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(selectedSpy).toHaveBeenCalledTimes(1);
    expect(selectedSpy).toHaveBeenCalledWith(0);
    expect(fixture.debugElement.queryAll(By.css('.lux-list-item-selected')).length).toBe(1);
  }));

  it('Sollte bei leerer Liste keinen Fehler werfen wenn Space/Enter gedrückt wird', fakeAsync(() => {
    // Liste bleibt leer – kein addListItems()
    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    expect(() => {
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', SPACE);
      LuxTestHelper.wait(fixture);
    }).not.toThrow();
  }));

  it('Sollte über die Pfeiltasten + Space/Enter ein LuxListItem selektieren können', fakeAsync(() => {
    // Vorbedingungen testen
    const selectedSpy = spyOn(testComponent, 'onSelected');
    const focusedSpy = spyOn(testComponent, 'onFocused');
    const focusedItemSpy = spyOn(testComponent, 'onFocusedItem');

    expect(fixture.debugElement.query(By.css('.lux-list-item-selected'))).toBeNull();

    // Änderungen durchführen
    testComponent.addListItems(5);
    LuxTestHelper.wait(fixture);

    const listItems = fixture.debugElement.queryAll(By.directive(LuxListItemComponent));
    const listNativeElement = fixture.debugElement.query(By.css('lux-list')).nativeElement;

    LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
    fixture.detectChanges();
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', SPACE);
    LuxTestHelper.wait(fixture);

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
    LuxTestHelper.wait(fixture);
    LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ENTER);
    LuxTestHelper.wait(fixture);

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
  }));

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

    it('Sollte interaktive Elemente initial tabindex="-1" haben', fakeAsync(() => {
      // Änderungen durchführen
      testI.addListItems(3);
      LuxTestHelper.wait(fixtureI);

      // Nachbedingungen prüfen
      const buttons = fixtureI.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(-1);
      });
    }));

    it('Sollte bei Enter den Edit-Modus aktivieren und Buttons im aktiven Item tabindex="0" setzen', fakeAsync(() => {
      // Änderungen durchführen
      testI.addListItems(3);
      LuxTestHelper.wait(fixtureI);

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ENTER);
      LuxTestHelper.wait(fixtureI);

      // Nachbedingungen prüfen: aktives Item (Index 0) hat tabIndex=0
      const listItems = fixtureI.debugElement.queryAll(By.directive(LuxListItemComponent));
      listItems[0].queryAll(By.css('button')).forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(0);
      });
      // Alle anderen Items haben tabIndex=-1
      listItems[1].queryAll(By.css('button')).forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(-1);
      });
    }));

    it('Sollte bei Space den Edit-Modus aktivieren', fakeAsync(() => {
      // Änderungen durchführen
      testI.addListItems(3);
      LuxTestHelper.wait(fixtureI);

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', SPACE);
      LuxTestHelper.wait(fixtureI);

      // Nachbedingungen prüfen
      fixtureI.debugElement
        .queryAll(By.directive(LuxListItemComponent))[0]
        .queryAll(By.css('button'))
        .forEach((btn) => {
          expect(btn.nativeElement.tabIndex).toBe(0);
        });
    }));

    it('Sollte bei Escape den Edit-Modus beenden und tabindex="-1" wiederherstellen', fakeAsync(() => {
      // Änderungen durchführen
      testI.addListItems(3);
      LuxTestHelper.wait(fixtureI);

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();

      // Edit-Modus aktivieren
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ENTER);
      LuxTestHelper.wait(fixtureI);

      // Vorbedingung: Buttons im aktiven Item haben tabIndex=0
      fixtureI.debugElement
        .queryAll(By.directive(LuxListItemComponent))[0]
        .queryAll(By.css('button'))
        .forEach((btn) => {
          expect(btn.nativeElement.tabIndex).toBe(0);
        });

      // Edit-Modus beenden via Escape
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', ESCAPE);
      LuxTestHelper.wait(fixtureI);

      // Nachbedingungen prüfen: alle Buttons haben wieder tabIndex=-1
      fixtureI.debugElement.queryAll(By.css('button')).forEach((btn) => {
        expect(btn.nativeElement.tabIndex).toBe(-1);
      });
    }));

    it('Sollte mit ArrowDown im Normal-Modus zur nächsten Zeile navigieren', fakeAsync(() => {
      // Vorbedingungen testen
      const focusedSpy = spyOn(testI, 'onFocused');

      // Änderungen durchführen
      testI.addListItems(3);
      LuxTestHelper.wait(fixtureI);

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
      LuxTestHelper.wait(fixtureI);

      // Nachbedingungen prüfen
      expect(focusedSpy).toHaveBeenCalledWith(1);
    }));

    it('Sollte mit Home/End zur ersten und letzten Zeile navigieren', fakeAsync(() => {
      // Vorbedingungen testen
      const focusedSpy = spyOn(testI, 'onFocused');

      // Änderungen durchführen
      testI.addListItems(5);
      LuxTestHelper.wait(fixtureI);

      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(listNativeElement, 'focus', true);
      fixtureI.detectChanges();

      // Zur Mitte navigieren
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', DOWN_ARROW);
      LuxTestHelper.wait(fixtureI);

      // Home → ersten Eintrag
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', HOME);
      LuxTestHelper.wait(fixtureI);
      expect(focusedSpy).toHaveBeenCalledWith(0);

      // End → letzten Eintrag
      LuxTestHelper.dispatchKeyboardEvent(listNativeElement, 'keydown', END);
      LuxTestHelper.wait(fixtureI);
      expect(focusedSpy).toHaveBeenCalledWith(4);
    }));

    it('Sollte role="grid" auf lux-list und role="row" auf lux-list-item setzen', fakeAsync(() => {
      // Änderungen durchführen
      testI.addListItems(2);
      LuxTestHelper.wait(fixtureI);

      // Nachbedingungen prüfen
      const listNativeElement = fixtureI.debugElement.query(By.css('lux-list')).nativeElement;
      expect(listNativeElement.getAttribute('role')).toBe('grid');

      fixtureI.debugElement.queryAll(By.directive(LuxListItemComponent)).forEach((item) => {
        expect(item.nativeElement.getAttribute('role')).toBe('row');
      });
    }));
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
      [luxSelectedPosition]="selectedPosition"
      (luxSelectedPositionChange)="onSelected($event)"
      (luxFocusedPositionChange)="onFocused($event)"
      (luxFocusedItemChange)="onFocusedItem($event)"
    >
      @for (item of list; track item.title; let i = $index) {
        <lux-list-item [luxTitle]="item.title" [luxSubTitle]="item.subTitle" [luxSelected]="item.selected">
          <lux-list-item-icon>
            <lux-icon luxIconName="lux-interface-user-single"></lux-icon>
          </lux-list-item-icon>
          <lux-list-item-content> Item-Content #{{ i }} </lux-list-item-content>
        </lux-list-item>
      }
    </lux-list>
  `,
  imports: [LuxListComponent, LuxListItemComponent, LuxListItemContentComponent, LuxListItemIconComponent, LuxIconComponent]
})
class MockListComponent {
  selectedPosition?: number;

  list: { title: string; subTitle: string; selected: boolean }[] = [];

  constructor() {}

  onSelected(event: number) {}

  onFocused(event: number) {}

  onFocusedItem(event: LuxListItemComponent) {}

  addListItems(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.list.push({
        title: 'Title ' + i,
        subTitle: 'SubTitle ' + i,
        selected: false
      });
    }
  }
}

@Component({
  selector: 'lux-mock-list-interactive',
  template: `
    <lux-list
      [luxSelectedPosition]="selectedPosition"
      (luxSelectedPositionChange)="onSelected($event)"
      (luxFocusedPositionChange)="onFocused($event)"
    >
      @for (item of list; track item.title) {
        <lux-list-item [luxTitle]="item.title">
          <lux-list-item-content>
            <button type="button" class="btn-a">Button A</button>
            <button type="button" class="btn-b">Button B</button>
          </lux-list-item-content>
        </lux-list-item>
      }
    </lux-list>
  `,
  imports: [LuxListComponent, LuxListItemComponent, LuxListItemContentComponent]
})
class MockListWithInteractiveComponent {
  selectedPosition?: number;
  list: { title: string }[] = [];

  onSelected(event: number) {}

  onFocused(event: number) {}

  addListItems(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.list.push({ title: 'Title ' + i });
    }
  }
}
