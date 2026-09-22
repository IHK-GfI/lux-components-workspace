import { describe, it, beforeEach, expect, vi } from 'vitest';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    menuComponent = fixture.debugElement.query(By.directive(LuxMenuComponent)).componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  it('Sollte erstellt werden', async () => {
    expect(component).toBeTruthy();
  });

  it('Sollte die MenuItems darstellen (nur im Menu und Extended)', async () => {
    // Vorbedingungen prüfen
    let menuItems = fixture.debugElement.queryAll(By.css('lux-menu-item'));
    expect(menuItems.length).toBe(0);
    expect(menuComponent.menuItems.length).toBe(0);
    expect(component.displayExtended()).toBe(true);

    // Änderungen durchführen
    component.generateItems(3);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    menuItems = fixture.debugElement.queryAll(By.css('lux-button.lux-menu-item'));
    expect(menuItems.length).toBe(3);
    expect(menuComponent.menuItems.length).toBe(3);

    // Änderungen durchführen
    component.displayExtended.set(false);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    const extendedMenuItems = fixture.debugElement.queryAll(By.css('lux-button.lux-menu-item'));
    expect(extendedMenuItems.length).toBe(3);
  });

  it('Sollte die MenuItems korrekt ausblenden wenn der Platz nicht mehr ausreicht', async () => {
    // Vorbedingungen testen
    component.generateItems(3);
    await updateExtendedMenuItems();
    expect(component.displayExtended()).toBe(true);

    const menuDebugEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    const offsetWidthSpy = vi.spyOn(menuDebugEl.nativeElement, 'offsetWidth', 'get').mockReturnValue(1200);
    const triggerDebugEl = fixture.debugElement.query(By.css('div.lux-menu-trigger'));
    vi.spyOn(triggerDebugEl.nativeElement, 'offsetWidth', 'get').mockReturnValue(190);
    await updateExtendedMenuItems();

    let extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(3);

    // Änderungen durchführen
    offsetWidthSpy.mockReturnValue(300);
    await updateExtendedMenuItems();

    // Nachbedingungen prüfen
    extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBeGreaterThan(0);
    expect(extendedMenuItems.length).toBeLessThan(3);
  });

  it('Sollte einen eigenen Toggle-Button injecten', async () => {
    // Vorbedingungen testen
    component.generateItems(3);
    component.displayExtended.set(false);
    fixture.detectChanges();

    let defaultTriggerNode = fixture.debugElement.query(By.css('.lux-menu-trigger-default'));
    let mockTriggerNode = fixture.debugElement.query(By.css('.mock-trigger'));

    expect(defaultTriggerNode).not.toBeNull();
    expect(mockTriggerNode).toBeNull();

    // Änderungen durchführen
    component.showMockTrigger.set(true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    defaultTriggerNode = fixture.debugElement.query(By.css('.lux-menu-trigger-default'));
    mockTriggerNode = fixture.debugElement.query(By.css('.mock-trigger'));

    expect(defaultTriggerNode).toBeNull();
    expect(mockTriggerNode).not.toBeNull();
  });

  it('Sollte nur n (n = luxMaximumExtend) Menu-Items darstellen', async () => {
    // Vorbedingungen testen
    component.generateItems(3);
    await updateExtendedMenuItems();

    const menuDebugEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    vi.spyOn(menuDebugEl.nativeElement, 'offsetWidth', 'get').mockReturnValue(1200);
    const triggerDebugEl = fixture.debugElement.query(By.css('div.lux-menu-trigger'));
    vi.spyOn(triggerDebugEl.nativeElement, 'offsetWidth', 'get').mockReturnValue(200);
    await updateExtendedMenuItems();

    let extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(3);

    // Änderungen durchführen
    component.maximumExtended.set(1);
    await updateExtendedMenuItems();

    // Nachbedingungen prüfen
    extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(1);

    // Änderungen durchführen
    component.maximumExtended.set(2);
    await updateExtendedMenuItems();

    // Nachbedingungen prüfen
    extendedMenuItems = fixture.debugElement.queryAll(By.css('.lux-menu-item:not([style*=none])'));
    expect(extendedMenuItems.length).toBe(2);
  });

  it('Sollte das extendedMenu rechtsbündig darstellen', async () => {
    // Vorbedingungen testen
    component.generateItems(3);
    component.maximumExtended.set(2);
    component.displayMenuLeft.set(true);
    await updateExtendedMenuItems();

    let menuExtendedEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    let children = menuExtendedEl.children;

    expect(children[0].nativeElement.classList).toContain('lux-menu-item');

    // Änderungen durchführen
    component.displayMenuLeft.set(false);
    await updateExtendedMenuItems();

    menuExtendedEl = fixture.debugElement.query(By.css('div.lux-menu-extended'));
    children = menuExtendedEl.children;

    expect(children[0].nativeElement.classList).toContain('lux-menu-trigger');
  });

  it('Sollte Menu-Items deaktivieren', async () => {
    // Vorbedingungen testen
    component.generateItems(3);
    await updateExtendedMenuItems();

    menuComponent.menuTriggerElRef!.nativeElement.click();
    fixture.detectChanges();

    let disabledLength = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden) button[disabled]')).length;
    expect(disabledLength).toBe(0);

    // Änderungen durchführen
    component.items()[0].disabled = true;
    component.items()[1].disabled = true;
    component.items()[2].disabled = true;
    fixture.detectChanges();

    menuComponent.menuTriggerElRef!.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen prüfen
    disabledLength = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden) button[disabled]')).length;
    expect(disabledLength).toBe(3);

    fixture.detectChanges();
  });

  it('Sollte zur Laufzeit weitere Menu-Items hinzufügen können', async () => {
    // Vorbedingungen testen
    component.generateItems(3);
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden)'));
    expect(items.length).toBe(3);

    // Änderungen durchführen
    component.pushItems(2);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    items = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden)'));
    expect(items.length).toBe(5);
  });

  it('Sollte den Fokus auf den Custom-Trigger zurücksetzen nach dem Schließen des Menüs', async () => {
    // Vorbedingungen prüfen
    component.generateItems(3);
    component.showMockTrigger.set(true);
    fixture.detectChanges();

    const mockTriggerBtn = fixture.debugElement.query(By.css('.mock-trigger')).nativeElement as HTMLElement;
    const focusSpy = vi.spyOn(mockTriggerBtn, 'focus').mockReturnValue(undefined);

    // Menü schließen simulieren
    menuComponent.onMenuClosed();
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(focusSpy).toHaveBeenCalled();
  });

  it('Sollte den Fokus auf den Default-Trigger zurücksetzen nach dem Schließen des Menüs (kein Custom-Trigger)', async () => {
    // Vorbedingungen prüfen
    component.generateItems(3);
    component.showMockTrigger.set(false);
    fixture.detectChanges();

    const defaultTriggerBtn = menuComponent.defaultTriggerElRef!.nativeElement.children.item(0) as HTMLElement;
    const focusSpy = vi.spyOn(defaultTriggerBtn, 'focus').mockReturnValue(undefined);

    // Menü schließen simulieren
    menuComponent.onMenuClosed();
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(focusSpy).toHaveBeenCalled();
  });

  it('Sollte Panel-Items mit warn/accent Farbe die entsprechende Farbklasse vergeben', async () => {
    // Vorbedingungen
    component.generateItems(3);
    component.displayExtended.set(false);
    component.items()[0].color = 'warn';
    component.items()[1].color = 'accent';
    component.items()[2].color = 'primary';
    fixture.detectChanges();

    // Menü öffnen
    menuComponent.menuTriggerElRef!.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen
    const overlayEl = overlayContainer.getContainerElement();
    const warnItems = overlayEl.querySelectorAll('button.lux-menu-item.lux-menu-item-color-warn');
    const accentItems = overlayEl.querySelectorAll('button.lux-menu-item.lux-menu-item-color-accent');
    const primaryItems = overlayEl.querySelectorAll('button.lux-menu-item:not(.lux-menu-item-color-warn):not(.lux-menu-item-color-accent)');

    expect(warnItems.length).toBe(1);
    expect(accentItems.length).toBe(1);
    expect(primaryItems.length).toBe(1);

    fixture.detectChanges();
  });

  describe('Attribut "luxDisabledAria"', () => {
    it('Sollte sichtbare Buttons als aria-disabled markieren (kein natives disabled)', async () => {
      // Vorbedingungen prüfen
      component.generateItems(3);
      component.items()[0].disabledAria = true;
      await updateExtendedMenuItems();

      // Nachbedingungen prüfen
      const ariaDisabledButtons = fixture.debugElement.queryAll(By.css('.lux-menu-item:not(.lux-hidden) button[aria-disabled="true"]'));
      expect(ariaDisabledButtons.length).toBe(1);
      expect(ariaDisabledButtons[0].nativeElement.hasAttribute('disabled')).toBe(false);
    });

    it('Sollte bei sichtbaren Buttons luxClickNotAllowed statt luxClicked emittieren', async () => {
      // Vorbedingungen prüfen
      const clickedSpy = vi.spyOn(component, 'clicked').mockReturnValue(undefined);
      const notAllowedSpy = vi.spyOn(component, 'clickNotAllowed').mockReturnValue(undefined);
      component.generateItems(1);
      component.items()[0].disabledAria = true;
      await updateExtendedMenuItems();

      // Änderungen durchführen
      const buttonEl = fixture.debugElement.query(By.css('.lux-menu-item:not(.lux-hidden) button'));
      buttonEl.nativeElement.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(notAllowedSpy).toHaveBeenCalledTimes(1);
      expect(clickedSpy).not.toHaveBeenCalled();
    });

    it('Sollte Panel-Items als aria-disabled markieren, ohne natives disabled (bleiben fokussierbar)', async () => {
      // Vorbedingungen prüfen
      component.generateItems(3);
      component.displayExtended.set(false);
      component.items()[1].disabledAria = true;
      fixture.detectChanges();

      // Änderungen durchführen
      menuComponent.menuTriggerElRef!.nativeElement.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const overlayEl = overlayContainer.getContainerElement();
      const ariaDisabledItems = overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]');
      expect(ariaDisabledItems.length).toBe(1);
      // Kein natives disabled: Item bleibt fokussierbar und wird von der
      // Pfeiltasten-Navigation des mat-menu nicht übersprungen.
      expect(ariaDisabledItems[0].hasAttribute('disabled')).toBe(false);

      fixture.detectChanges();
    });

    it('Sollte bei Panel-Items luxClickNotAllowed statt luxClicked emittieren', async () => {
      // Vorbedingungen prüfen
      const clickedSpy = vi.spyOn(component, 'clicked').mockReturnValue(undefined);
      const notAllowedSpy = vi.spyOn(component, 'clickNotAllowed').mockReturnValue(undefined);
      component.generateItems(2);
      component.displayExtended.set(false);
      component.items()[0].disabledAria = true;
      fixture.detectChanges();

      // Änderungen durchführen
      menuComponent.menuTriggerElRef!.nativeElement.click();
      fixture.detectChanges();

      const overlayEl = overlayContainer.getContainerElement();
      const ariaDisabledItem = overlayEl.querySelector('button.lux-menu-item[aria-disabled="true"]') as HTMLElement;
      ariaDisabledItem.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(notAllowedSpy).toHaveBeenCalledTimes(1);
      expect(clickedSpy).not.toHaveBeenCalled();

      fixture.detectChanges();
    });

    it('Sollte aria-disabled behalten, wenn luxDisabled zur Laufzeit von true auf false wechselt', async () => {
      // Regression: Das MatMenuItem-Host-Binding (aria-disabled = disabled) schreibt das
      // Attribut bei einer eigenen Wertänderung neu und würde den Direktiven-Wert überschreiben.
      component.generateItems(2);
      component.displayExtended.set(false);
      component.items()[0].disabledAria = true;
      component.items()[0].disabled = true;
      fixture.detectChanges();

      menuComponent.menuTriggerElRef!.nativeElement.click();
      fixture.detectChanges();

      component.items.update((items) => items.map((item, index) => (index === 0 ? { ...item, disabled: false } : item)));
      fixture.detectChanges();

      const overlayEl = overlayContainer.getContainerElement();
      const ariaDisabledItems = overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]');
      expect(ariaDisabledItems.length).toBe(1);
      expect(ariaDisabledItems[0].hasAttribute('disabled')).toBe(false);

      fixture.detectChanges();
    });

    it('Sollte aria-disabled entfernen, wenn luxDisabledAria zurückgesetzt wird', async () => {
      component.generateItems(2);
      component.displayExtended.set(false);
      component.items()[0].disabledAria = true;
      fixture.detectChanges();

      menuComponent.menuTriggerElRef!.nativeElement.click();
      fixture.detectChanges();

      component.items.update((items) => items.map((item, index) => (index === 0 ? { ...item, disabledAria: false } : item)));
      fixture.detectChanges();

      const overlayEl = overlayContainer.getContainerElement();
      expect(overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]').length).toBe(0);

      fixture.detectChanges();
    });

    it('Sollte luxHidden unverändert lassen (verstecktes Item erscheint trotz luxDisabledAria nicht im Panel)', async () => {
      component.generateItems(2);
      component.displayExtended.set(false);
      component.items()[0].disabledAria = true;
      component.items()[0].hidden = true;
      fixture.detectChanges();

      menuComponent.menuTriggerElRef!.nativeElement.click();
      fixture.detectChanges();

      const overlayEl = overlayContainer.getContainerElement();
      expect(overlayEl.querySelectorAll('button.lux-menu-item').length).toBe(1);
      expect(overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]').length).toBe(0);

      fixture.detectChanges();
    });

    it('Sollte luxDisabled unverändert lassen (natives disabled, kein luxClickNotAllowed)', async () => {
      // Vorbedingungen prüfen
      const notAllowedSpy = vi.spyOn(component, 'clickNotAllowed').mockReturnValue(undefined);
      component.generateItems(2);
      component.displayExtended.set(false);
      component.items()[0].disabled = true;
      fixture.detectChanges();

      // Änderungen durchführen
      menuComponent.menuTriggerElRef!.nativeElement.click();
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const overlayEl = overlayContainer.getContainerElement();
      const disabledItems = overlayEl.querySelectorAll('button.lux-menu-item[disabled]');
      expect(disabledItems.length).toBe(1);
      expect(notAllowedSpy).not.toHaveBeenCalled();

      fixture.detectChanges();
    });
  });

  const updateExtendedMenuItems = async () => {
    fixture.detectChanges();
    menuComponent.updateExtendedMenuItems();
    fixture.detectChanges();
  };
});

interface MockMenuItem {
  label: string;
  cmd?: string;
  iconName?: string;
  tagId: string;
  alwaysVisible: boolean;
  disabled: boolean;
  disabledAria: boolean;
  hidden: boolean;
  raised?: boolean;
  color: LuxThemePalette;
}

@Component({
  template: `<lux-menu
    luxTagId="mock-menu"
    [luxDisplayMenuLeft]="displayMenuLeft()"
    [luxDisplayExtended]="displayExtended()"
    [luxMaximumExtended]="maximumExtended()"
    [luxClassName]="className()"
    (luxMenuClosed)="closed()"
  >
    @for (item of items(); track item.label) {
      <lux-menu-item
        [luxLabel]="item.label"
        [luxIconName]="item.iconName"
        [luxTagId]="item.label"
        [luxAlwaysVisible]="item.alwaysVisible"
        [luxDisabled]="item.disabled"
        [luxDisabledAria]="item.disabledAria"
        [luxHidden]="item.hidden"
        [luxRaised]="item.raised"
        [luxColor]="item.color"
        (luxClicked)="clicked()"
        (luxClickNotAllowed)="clickNotAllowed()"
      >
      </lux-menu-item>
    }
    @if (showMockTrigger()) {
      <lux-menu-trigger>
        <button class="mock-trigger">Mock-Spock</button>
      </lux-menu-trigger>
    }
  </lux-menu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxMenuComponent, LuxMenuItemComponent, LuxMenuTriggerComponent]
})
class MockComponent {
  displayMenuLeft = signal(true);
  displayExtended = signal(true);
  maximumExtended = signal(5);
  className = signal('');
  showMockTrigger = signal(false);

  items = signal<MockMenuItem[]>([]);

  clicked() {}

  clickNotAllowed() {}

  closed() {}

  generateItems(amount: number) {
    this.items.set([]);
    this.pushItems(amount);
  }

  pushItems(amount: number) {
    const start = this.items().length;
    const newItems: MockMenuItem[] = [];
    for (let i = 0; i < amount; i++) {
      newItems.push({
        label: 'Label ' + (start + i),
        tagId: 'TagId ' + (start + i),
        alwaysVisible: false,
        disabled: false,
        disabledAria: false,
        hidden: false,
        color: 'primary'
      });
    }
    this.items.update((items) => [...items, ...newItems]);
  }
}
