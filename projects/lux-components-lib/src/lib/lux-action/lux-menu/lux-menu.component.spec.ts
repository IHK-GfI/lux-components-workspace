import { OverlayContainer } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxMenuItemComponent } from '../lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from './lux-menu.component';

describe('LuxMenuComponent', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let menuComponent: LuxMenuComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    menuComponent = fixture.debugElement.query(By.directive(LuxMenuComponent)).componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  it('Sollte erstellt werden', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('Sollte die MenuItems darstellen (nur im Menu und Extended)', fakeAsync(() => {
    // Vorbedingungen prüfen
    let menuItems = fixture.debugElement.queryAll(By.css('lux-menu-item'));
    expect(menuItems.length).toBe(0);
    expect(menuComponent.menuItems.length).toBe(0);
    expect(component.displayExtended).toBeTrue();

    // Änderungen durchführen
    component.generateItems(3);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    menuItems = fixture.debugElement.queryAll(By.css('lux-button.lux-menu-item'));
    expect(menuItems.length).toBe(3);
    expect(menuComponent.menuItems.length).toBe(3);

    // Änderungen durchführen
    component.displayExtended = false;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    const extendedMenuItems = fixture.debugElement.queryAll(By.css('lux-button.lux-menu-item'));
    expect(extendedMenuItems.length).toBe(3);
  }));

  it('Sollte die MenuItems korrekt ausblenden wenn der Platz nicht mehr ausreicht', fakeAsync(() => {
    // Vorbedingungen testen
    component.generateItems(3);
    updateExtendedMenuItems();
    expect(component.displayExtended).toBeTrue();

    const menuDebugEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    const offsetWidthSpy = spyOnProperty(menuDebugEl.nativeElement, 'offsetWidth', 'get').and.returnValue(1200);
    const triggerDebugEl = fixture.debugElement.query(By.css('div.lux-menu-trigger'));
    spyOnProperty(triggerDebugEl.nativeElement, 'offsetWidth', 'get').and.returnValue(190);
    updateExtendedMenuItems();

    let extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(3);

    // Änderungen durchführen
    offsetWidthSpy.and.returnValue(300);
    updateExtendedMenuItems();

    // Nachbedingungen prüfen
    extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBeGreaterThan(0);
    expect(extendedMenuItems.length).toBeLessThan(3);
  }));

  it('Sollte einen eigenen Toggle-Button injecten', fakeAsync(() => {
    // Vorbedingungen testen
    component.generateItems(3);
    component.displayExtended = false;
    LuxTestHelper.wait(fixture);

    let defaultTriggerNode = fixture.debugElement.query(By.css('.lux-menu-trigger-default'));
    let mockTriggerNode = fixture.debugElement.query(By.css('.mock-trigger'));

    expect(defaultTriggerNode).not.toBeNull();
    expect(mockTriggerNode).toBeNull();

    // Änderungen durchführen
    component.showMockTrigger = true;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    defaultTriggerNode = fixture.debugElement.query(By.css('.lux-menu-trigger-default'));
    mockTriggerNode = fixture.debugElement.query(By.css('.mock-trigger'));

    expect(defaultTriggerNode).toBeNull();
    expect(mockTriggerNode).not.toBeNull();
  }));

  it('Sollte nur n (n = luxMaximumExtend) Menu-Items darstellen', fakeAsync(() => {
    // Vorbedingungen testen
    component.generateItems(3);
    updateExtendedMenuItems();

    const menuDebugEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    spyOnProperty(menuDebugEl.nativeElement, 'offsetWidth', 'get').and.returnValue(1200);
    const triggerDebugEl = fixture.debugElement.query(By.css('div.lux-menu-trigger'));
    spyOnProperty(triggerDebugEl.nativeElement, 'offsetWidth', 'get').and.returnValue(200);
    updateExtendedMenuItems();

    let extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(3);

    // Änderungen durchführen
    component.maximumExtended = 1;
    updateExtendedMenuItems();

    // Nachbedingungen prüfen
    extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(1);

    // Änderungen durchführen
    component.maximumExtended = 2;
    updateExtendedMenuItems();

    // Nachbedingungen prüfen
    extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(2);
  }));

  it('Sollte das extendedMenu rechtsbündig darstellen', fakeAsync(() => {
    // Vorbedingungen testen
    component.generateItems(3);
    component.maximumExtended = 2;
    component.displayMenuLeft = true;
    updateExtendedMenuItems();

    let menuExtendedEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    let children = menuExtendedEl.children;

    expect(children[0].nativeElement.classList).toContain('lux-menu-item');

    // Änderungen durchführen
    component.displayMenuLeft = false;
    updateExtendedMenuItems();

    menuExtendedEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    children = menuExtendedEl.children;

    expect(children[0].nativeElement.classList).toContain('lux-menu-trigger');
  }));

  it('Sollte Menu-Items deaktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    component.generateItems(3);
    updateExtendedMenuItems();

    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);

    let disabledLength = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden) button[disabled]')).length;
    expect(disabledLength).toBe(0);

    // Änderungen durchführen
    component.items[0].disabled = true;
    component.items[1].disabled = true;
    component.items[2].disabled = true;
    LuxTestHelper.wait(fixture);

    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    disabledLength = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden) button[disabled]')).length;
    expect(disabledLength).toBe(3);

    flush();
    discardPeriodicTasks();
  }));

  it('Sollte zur Laufzeit weitere Menu-Items hinzufügen können', fakeAsync(() => {
    // Vorbedingungen testen
    component.generateItems(3);
    LuxTestHelper.wait(fixture);

    let items = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden)'));
    expect(items.length).toBe(3);

    // Änderungen durchführen
    component.pushItems(2);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    items = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden)'));
    expect(items.length).toBe(5);
  }));

  it('Sollte den Fokus auf den Custom-Trigger zurücksetzen nach dem Schließen des Menüs', fakeAsync(() => {
    // Vorbedingungen prüfen
    component.generateItems(3);
    component.showMockTrigger = true;
    LuxTestHelper.wait(fixture);

    const mockTriggerBtn = fixture.debugElement.query(By.css('.mock-trigger')).nativeElement as HTMLElement;
    const focusSpy = spyOn(mockTriggerBtn, 'focus');

    // Menü schließen simulieren
    menuComponent.onMenuClosed();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('Sollte den Fokus auf den Default-Trigger zurücksetzen nach dem Schließen des Menüs (kein Custom-Trigger)', fakeAsync(() => {
    // Vorbedingungen prüfen
    component.generateItems(3);
    component.showMockTrigger = false;
    LuxTestHelper.wait(fixture);

    const defaultTriggerBtn = menuComponent.defaultTriggerElRef!.nativeElement.children.item(0) as HTMLElement;
    const focusSpy = spyOn(defaultTriggerBtn, 'focus');

    // Menü schließen simulieren
    menuComponent.onMenuClosed();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('Sollte Panel-Items mit warn/accent Farbe die entsprechende Farbklasse vergeben', fakeAsync(() => {
    // Vorbedingungen
    component.generateItems(3);
    component.displayExtended = false;
    component.items[0].color = 'warn';
    component.items[1].color = 'accent';
    component.items[2].color = 'primary';
    LuxTestHelper.wait(fixture);

    // Menü öffnen
    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen
    const overlayEl = overlayContainer.getContainerElement();
    const warnItems = overlayEl.querySelectorAll('button.lux-menu-item.lux-menu-item-color-warn');
    const accentItems = overlayEl.querySelectorAll('button.lux-menu-item.lux-menu-item-color-accent');
    const primaryItems = overlayEl.querySelectorAll('button.lux-menu-item:not(.lux-menu-item-color-warn):not(.lux-menu-item-color-accent)');

    expect(warnItems.length).toBe(1);
    expect(accentItems.length).toBe(1);
    expect(primaryItems.length).toBe(1);

    flush();
    discardPeriodicTasks();
  }));

  describe('Attribut "luxDisabledAria"', () => {
    it('Sollte sichtbare Buttons als aria-disabled markieren (kein natives disabled)', fakeAsync(() => {
      // Vorbedingungen prüfen
      component.generateItems(3);
      component.items[0].disabledAria = true;
      updateExtendedMenuItems();

      // Nachbedingungen prüfen
      const ariaDisabledButtons = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden) button[aria-disabled="true"]'));
      expect(ariaDisabledButtons.length).toBe(1);
      expect(ariaDisabledButtons[0].nativeElement.hasAttribute('disabled')).toBeFalse();
    }));

    it('Sollte bei sichtbaren Buttons luxClickNotAllowed statt luxClicked emittieren', fakeAsync(() => {
      // Vorbedingungen prüfen
      const clickedSpy = spyOn(component, 'clicked');
      const notAllowedSpy = spyOn(component, 'clickNotAllowed');
      component.generateItems(1);
      component.items[0].disabledAria = true;
      updateExtendedMenuItems();

      // Änderungen durchführen
      const buttonEl = fixture.debugElement.query(By.css('.lux-menu-item:not(.lux-hidden) button'));
      buttonEl.nativeElement.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(notAllowedSpy).toHaveBeenCalledTimes(1);
      expect(clickedSpy).not.toHaveBeenCalled();
    }));

    it('Sollte Panel-Items als aria-disabled markieren, ohne natives disabled (bleiben fokussierbar)', fakeAsync(() => {
      // Vorbedingungen prüfen
      component.generateItems(3);
      component.displayExtended = false;
      component.items[1].disabledAria = true;
      LuxTestHelper.wait(fixture);

      // Änderungen durchführen
      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const overlayEl = overlayContainer.getContainerElement();
      const ariaDisabledItems = overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]');
      expect(ariaDisabledItems.length).toBe(1);
      // Kein natives disabled: Item bleibt fokussierbar und wird von der
      // Pfeiltasten-Navigation des mat-menu nicht übersprungen.
      expect(ariaDisabledItems[0].hasAttribute('disabled')).toBeFalse();

      flush();
      discardPeriodicTasks();
    }));

    it('Sollte bei Panel-Items luxClickNotAllowed statt luxClicked emittieren', fakeAsync(() => {
      // Vorbedingungen prüfen
      const clickedSpy = spyOn(component, 'clicked');
      const notAllowedSpy = spyOn(component, 'clickNotAllowed');
      component.generateItems(2);
      component.displayExtended = false;
      component.items[0].disabledAria = true;
      LuxTestHelper.wait(fixture);

      // Änderungen durchführen
      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      const overlayEl = overlayContainer.getContainerElement();
      const ariaDisabledItem = overlayEl.querySelector('button.lux-menu-item[aria-disabled="true"]') as HTMLElement;
      ariaDisabledItem.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(notAllowedSpy).toHaveBeenCalledTimes(1);
      expect(clickedSpy).not.toHaveBeenCalled();

      flush();
      discardPeriodicTasks();
    }));

    it('Sollte luxDisabled unverändert lassen (natives disabled, kein luxClickNotAllowed)', fakeAsync(() => {
      // Vorbedingungen prüfen
      const notAllowedSpy = spyOn(component, 'clickNotAllowed');
      component.generateItems(2);
      component.displayExtended = false;
      component.items[0].disabled = true;
      LuxTestHelper.wait(fixture);

      // Änderungen durchführen
      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const overlayEl = overlayContainer.getContainerElement();
      const disabledItems = overlayEl.querySelectorAll('button.lux-menu-item[disabled]');
      expect(disabledItems.length).toBe(1);
      expect(notAllowedSpy).not.toHaveBeenCalled();

      flush();
      discardPeriodicTasks();
    }));
  });

  const updateExtendedMenuItems = () => {
    LuxTestHelper.wait(fixture);
    menuComponent.updateExtendedMenuItems();
    LuxTestHelper.wait(fixture);
  };
});

@Component({
  template: `<lux-menu
    luxTagId="mock-menu"
    [luxDisplayMenuLeft]="displayMenuLeft"
    [luxDisplayExtended]="displayExtended"
    [luxMaximumExtended]="maximumExtended"
    [luxClassName]="className"
    (luxMenuClosed)="closed()"
  >
    @for (item of items; track item.label) {
      <lux-menu-item
        [luxLabel]="item.label"
        [luxIconName]="item.iconName"
        [luxTagId]="item.label"
        [luxAlwaysVisible]="item.alwaysVisible"
        [luxDisabled]="item.disabled"
        [luxDisabledAria]="item.disabledAria"
        [luxRaised]="item.raised"
        [luxColor]="item.color"
        (luxClicked)="clicked()"
        (luxClickNotAllowed)="clickNotAllowed()"
      >
      </lux-menu-item>
    }
    @if (showMockTrigger) {
      <lux-menu-trigger>
        <button class="mock-trigger">Mock-Spock</button>
      </lux-menu-trigger>
    }
  </lux-menu>`,
  imports: [LuxMenuComponent, LuxMenuItemComponent, LuxMenuTriggerComponent]
})
class MockComponent {
  displayMenuLeft = true;
  displayExtended = true;
  maximumExtended = 5;
  className = '';
  showMockTrigger = false;

  items: {
    label: string;
    cmd?: string;
    iconName?: string;
    tagId: string;
    alwaysVisible: boolean;
    disabled: boolean;
    disabledAria: boolean;
    raised?: boolean;
    color: LuxThemePalette;
  }[] = [];

  clicked() {}

  clickNotAllowed() {}

  closed() {}

  generateItems(amount: number) {
    this.items = [];
    this.pushItems(amount);
  }

  pushItems(amount: number) {
    const start = this.items.length;
    for (let i = 0; i < amount; i++) {
      this.items.push({
        label: 'Label ' + (start + i),
        tagId: 'TagId ' + (start + i),
        alwaysVisible: false,
        disabled: false,
        disabledAria: false,
        color: 'primary'
      });
    }
  }
}
