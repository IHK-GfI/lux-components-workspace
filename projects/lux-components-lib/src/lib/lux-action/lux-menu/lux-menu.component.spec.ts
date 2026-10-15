import { OverlayContainer } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxDividerComponent } from '../../lux-layout/lux-divider/lux-divider.component';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxMenuItemComponent } from '../lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from './lux-menu.component';

describe('LuxMenuComponent', () => {
  beforeAll(() => LuxA11yTestHelper.addA11yMatchers());
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

  it('Zeigt Divider nur zwischen sichtbaren Aktionen in Button-Row und Overflow', fakeAsync(() => {
    component.generateItems(4);
    component.items[0].dividerAfter = true;
    component.items[2].dividerAfter = true;
    LuxTestHelper.wait(fixture);

    const container = fixture.debugElement.query(By.css('.lux-menu-extended')).nativeElement as HTMLElement;
    spyOnProperty(container, 'offsetWidth', 'get').and.returnValue(1200);
    spyOnProperty(menuComponent.menuTriggerElRef!.nativeElement, 'offsetWidth', 'get').and.returnValue(50);
    updateExtendedMenuItems();

    expect(menuComponent.extendedMenuEntries.length).toBe(6);

    expect(Array.from(container.querySelectorAll('lux-button.lux-menu-item, lux-divider')).map((element) => element.tagName)).toEqual([
      'LUX-BUTTON',
      'LUX-DIVIDER',
      'LUX-BUTTON',
      'LUX-BUTTON',
      'LUX-DIVIDER',
      'LUX-BUTTON'
    ]);
    expect(container.querySelectorAll('lux-divider[aria-hidden="true"]')).toHaveSize(2);
    expect(container.querySelectorAll('lux-divider mat-divider.mat-divider-vertical')).toHaveSize(2);
    expect(container.querySelector('lux-divider button, lux-divider[tabindex]')).toBeNull();

    component.maximumExtended = 2;
    updateExtendedMenuItems();
    expect(container.querySelectorAll('mat-divider')).toHaveSize(1);
    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);
    expect(
      Array.from(overlayContainer.getContainerElement().querySelectorAll('button.lux-menu-item, mat-divider')).map(
        (element) => element.tagName
      )
    ).toEqual(['BUTTON', 'MAT-DIVIDER', 'BUTTON']);

    flush();
    discardPeriodicTasks();
  }));

  it('Unterdrueckt fuehrende, abschliessende und isolierte Divider nach Sichtbarkeitsaenderungen', fakeAsync(() => {
    component.generateItems(3);
    component.leadingDivider = true;
    component.trailingDivider = true;
    component.items[0].dividerAfter = true;
    component.items[1].dividerAfter = true;
    LuxTestHelper.wait(fixture);
    spyOnProperty(fixture.debugElement.query(By.css('.lux-menu-extended')).nativeElement, 'offsetWidth', 'get').and.returnValue(1200);
    spyOnProperty(menuComponent.menuTriggerElRef!.nativeElement, 'offsetWidth', 'get').and.returnValue(50);
    updateExtendedMenuItems();

    expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended mat-divider')).toHaveSize(2);
    component.items[1].hidden = true;
    updateExtendedMenuItems();
    expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended mat-divider')).toHaveSize(1);
    component.items[2].hidden = true;
    updateExtendedMenuItems();
    expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended mat-divider')).toHaveSize(0);

    component.displayExtended = false;
    updateExtendedMenuItems();
    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);
    expect(overlayContainer.getContainerElement().querySelectorAll('mat-divider')).toHaveSize(0);
    flush();
    discardPeriodicTasks();
  }));

  it('Zeigt konfigurierte Divider ohne weiteren Input in der Extended View und im Panel', fakeAsync(() => {
    component.generateItems(2);
    component.items[0].dividerAfter = true;
    LuxTestHelper.wait(fixture);
    spyOnProperty(fixture.debugElement.query(By.css('.lux-menu-extended')).nativeElement, 'offsetWidth', 'get').and.returnValue(1200);
    spyOnProperty(menuComponent.menuTriggerElRef!.nativeElement, 'offsetWidth', 'get').and.returnValue(50);
    updateExtendedMenuItems();
    expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended mat-divider')).toHaveSize(1);
    component.displayExtended = false;
    updateExtendedMenuItems();
    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);
    expect(overlayContainer.getContainerElement().querySelectorAll('mat-divider')).toHaveSize(1);
    flush();
    discardPeriodicTasks();
  }));

  it('Beruecksichtigt die Divider-Breite beim Verschieben in das Overflow-Menue', fakeAsync(() => {
    component.generateItems(2);
    component.items[0].dividerAfter = true;
    LuxTestHelper.wait(fixture);
    const itemWidth = menuComponent.menuItems.reduce((width, item) => width + item.width, 0);
    spyOnProperty(fixture.debugElement.query(By.css('.lux-menu-trigger')).nativeElement, 'offsetWidth', 'get').and.returnValue(50);
    spyOnProperty(fixture.debugElement.query(By.css('.lux-menu-extended')).nativeElement, 'offsetWidth', 'get').and.returnValue(
      itemWidth + 8
    );
    updateExtendedMenuItems();

    expect(menuComponent.menuItems.filter((item) => item.extended)).toHaveSize(1);
    expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended mat-divider')).toHaveSize(0);
  }));

  describe('Barrierefreiheit', () => {
    it('Hat mit vertikalem Divider in der erweiterten Button-Leiste keine Accessibility-Verstoesse', async () => {
      component.generateItems(2);
      component.items[0].dividerAfter = true;
      fixture.detectChanges();
      spyOnProperty(fixture.debugElement.query(By.css('.lux-menu-extended')).nativeElement, 'offsetWidth', 'get').and.returnValue(1200);
      spyOnProperty(menuComponent.menuTriggerElRef!.nativeElement, 'offsetWidth', 'get').and.returnValue(50);
      menuComponent.updateExtendedMenuItems();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended button')).toHaveSize(2);
      expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended mat-divider')).toHaveSize(1);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Hat im geoeffneten Menue mit horizontalem Divider keine Accessibility-Verstoesse', async () => {
      component.generateItems(2);
      component.items[0].dividerAfter = true;
      component.displayExtended = false;
      fixture.detectChanges();
      menuComponent.menuTriggerElRef!.nativeElement.click();
      await fixture.whenStable();

      const overlay = overlayContainer.getContainerElement();
      expect(overlay.querySelectorAll('button.lux-menu-item')).toHaveSize(2);
      expect(overlay.querySelectorAll('mat-divider')).toHaveSize(1);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      await LuxA11yTestHelper.expectNoA11yViolations(overlay);
    });

    it('Hat mit deaktivierter und ladender Aktion im geoeffneten Menue keine Accessibility-Verstoesse', async () => {
      component.generateItems(2);
      component.displayExtended = false;
      component.items[0].disabled = true;
      component.items[1].loading = true;
      fixture.detectChanges();
      menuComponent.menuTriggerElRef!.nativeElement.click();
      await fixture.whenStable();

      const overlay = overlayContainer.getContainerElement();
      expect(overlay.querySelectorAll('button.lux-menu-item')).toHaveSize(2);
      expect(overlay.querySelector('button.lux-menu-item[disabled]')).not.toBeNull();
      expect(overlay.querySelector('button.lux-menu-item[aria-disabled="true"] lux-progress')).not.toBeNull();
      await LuxA11yTestHelper.expectNoA11yViolations(overlay);
    });

    it('Hat bei teils erweiterten Aktionen und Overflow keine Accessibility-Verstoesse', async () => {
      component.generateItems(3);
      component.items[0].dividerAfter = true;
      component.items[1].dividerAfter = true;
      component.maximumExtended = 1;
      fixture.detectChanges();
      spyOnProperty(fixture.debugElement.query(By.css('.lux-menu-extended')).nativeElement, 'offsetWidth', 'get').and.returnValue(1200);
      menuComponent.updateExtendedMenuItems();
      fixture.detectChanges();
      menuComponent.menuTriggerElRef!.nativeElement.click();
      await fixture.whenStable();

      const overlay = overlayContainer.getContainerElement();
      expect(fixture.nativeElement.querySelectorAll('.lux-menu-extended lux-button.lux-menu-item:not([style*=none])')).toHaveSize(1);
      expect(overlay.querySelectorAll('button.lux-menu-item')).toHaveSize(2);
      expect(overlay.querySelectorAll('mat-divider')).toHaveSize(1);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      await LuxA11yTestHelper.expectNoA11yViolations(overlay);
    });

    for (const large of [false, true]) {
      it(`Hat im geoeffneten ${large ? 'Large-' : 'Sektions-'}Panel keine Accessibility-Verstoesse`, async () => {
        component.generateItems(2);
        component.displayExtended = false;
        component.showSections = true;
        component.largePanel = large;
        component.items[0].dividerAfter = true;
        fixture.detectChanges();
        menuComponent.menuTriggerElRef!.nativeElement.click();
        await fixture.whenStable();

        const overlay = overlayContainer.getContainerElement();
        expect(overlay.querySelectorAll('button.lux-menu-item')).toHaveSize(2);
        expect(overlay.querySelectorAll('mat-divider')).toHaveSize(1);
        await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
        await LuxA11yTestHelper.expectNoA11yViolations(overlay);
      });
    }
  });

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

  it('Sollte luxIconShowRight nur auf erweiterten Menu-Buttons anwenden', fakeAsync(() => {
    component.generateItems(1);
    component.items[0].iconName = 'lux-interface-setting-menu-1';
    component.items[0].iconShowRight = true;
    component.items[0].alwaysVisible = true;
    updateExtendedMenuItems();

    const extendedButton = fixture.debugElement.query(By.css('lux-button.lux-menu-item:not([style*=none]) button')).nativeElement;
    const extendedContent = extendedButton.querySelector('.lux-button-content-container') as HTMLElement;

    expect(extendedContent.children[0].classList).toContain('lux-button-label');
    expect(extendedContent.children[1].tagName).toBe('LUX-ICON');

    component.displayExtended = false;
    LuxTestHelper.wait(fixture);
    menuComponent.menuTriggerElRef!.nativeElement.click();
    LuxTestHelper.wait(fixture);

    const overlayEl = overlayContainer.getContainerElement();
    const menuItem = overlayEl.querySelector('button.lux-menu-item') as HTMLElement;
    const menuIcon = menuItem.querySelector('lux-icon') as HTMLElement;
    const menuLabel = menuItem.querySelector('.lux-button-label') as HTMLElement;

    expect(menuIcon.nextElementSibling).toBe(menuLabel);

    flush();
    discardPeriodicTasks();
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

  describe('Attribut "luxLoading"', () => {
    it('Sollte am erweiterten Button einen Spinner anzeigen und Klicks unterdruecken', fakeAsync(() => {
      const clickedSpy = spyOn(component, 'clicked');
      const notAllowedSpy = spyOn(component, 'clickNotAllowed');
      component.generateItems(1);
      component.items[0].loading = true;
      updateExtendedMenuItems();

      const button = fixture.debugElement.query(By.css('lux-button.lux-menu-item:not([style*=none]) button'));
      expect(button.nativeElement.querySelector('lux-progress')).not.toBeNull();
      expect(button.nativeElement.getAttribute('aria-disabled')).toBe('true');
      button.nativeElement.click();
      LuxTestHelper.wait(fixture);

      expect(clickedSpy).not.toHaveBeenCalled();
      expect(notAllowedSpy).toHaveBeenCalledTimes(1);

      component.items[0].loading = false;
      LuxTestHelper.wait(fixture);
      expect(button.nativeElement.querySelector('lux-progress')).toBeNull();
      expect(button.nativeElement.getAttribute('aria-disabled')).toBeNull();
    }));

    it('Sollte im Panel waehrend des Ladens aria-disabled setzen und Klicks unterdruecken', fakeAsync(() => {
      const clickedSpy = spyOn(component, 'clicked');
      const notAllowedSpy = spyOn(component, 'clickNotAllowed');
      component.generateItems(1);
      component.displayExtended = false;
      LuxTestHelper.wait(fixture);

      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      let button = overlayContainer.getContainerElement().querySelector('button.lux-menu-item') as HTMLButtonElement;
      expect(button.getAttribute('aria-disabled')).toBeNull();
      button.click();
      LuxTestHelper.wait(fixture);
      expect(clickedSpy).toHaveBeenCalledTimes(1);

      component.items[0].loading = true;
      LuxTestHelper.wait(fixture);
      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      button = overlayContainer.getContainerElement().querySelector('button.lux-menu-item') as HTMLButtonElement;
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.disabled).toBeFalse();
      expect(button.querySelector('lux-progress')).not.toBeNull();
      button.click();
      LuxTestHelper.wait(fixture);
      expect(clickedSpy).toHaveBeenCalledTimes(1);
      expect(notAllowedSpy).toHaveBeenCalledTimes(1);

      flush();
      discardPeriodicTasks();
    }));

    it('Sollte ein ladendes Panel-Item fokussierbar halten und beim Ende des Ladens den Fokus behalten', fakeAsync(() => {
      component.generateItems(1);
      component.displayExtended = false;
      component.items[0].loading = true;
      LuxTestHelper.wait(fixture);

      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      const button = overlayContainer.getContainerElement().querySelector('button.lux-menu-item') as HTMLButtonElement;
      expect(button.disabled).toBeFalse();
      expect(button.getAttribute('aria-disabled')).toBe('true');
      button.focus();
      expect(document.activeElement).toBe(button);

      component.items[0].loading = false;
      LuxTestHelper.wait(fixture);

      expect(overlayContainer.getContainerElement().querySelector('button.lux-menu-item')).toBe(button);
      expect(button.getAttribute('aria-disabled')).toBeNull();
      expect(document.activeElement).toBe(button);

      flush();
      discardPeriodicTasks();
    }));

    it('Sollte einen ladenden erweiterten Button fokussierbar halten und beim Ende des Ladens den Fokus behalten', fakeAsync(() => {
      component.generateItems(1);
      component.displayExtended = true;
      component.items[0].loading = true;
      updateExtendedMenuItems();

      const button = fixture.debugElement.query(By.css('lux-button.lux-menu-item:not([style*=none]) button'))
        .nativeElement as HTMLButtonElement;
      expect(button.disabled).toBeFalse();
      expect(button.getAttribute('aria-disabled')).toBe('true');
      button.focus();
      expect(document.activeElement).toBe(button);

      component.items[0].loading = false;
      LuxTestHelper.wait(fixture);

      expect(fixture.debugElement.query(By.css('lux-button.lux-menu-item:not([style*=none]) button')).nativeElement).toBe(button);
      expect(button.getAttribute('aria-disabled')).toBeNull();
      expect(document.activeElement).toBe(button);
    }));

    for (const large of [false, true]) {
      it(`Sollte im ${large ? 'Large-' : 'Sektions-'}Panel das Icon durch einen Spinner ersetzen`, fakeAsync(() => {
        component.generateItems(1);
        component.displayExtended = false;
        component.showSections = true;
        component.largePanel = large;
        component.items[0].iconName = 'lux-interface-setting-menu-1';
        component.items[0].loading = true;
        LuxTestHelper.wait(fixture);

        menuComponent.menuTriggerElRef!.nativeElement.click();
        LuxTestHelper.wait(fixture);

        const button = overlayContainer.getContainerElement().querySelector('button.lux-menu-item') as HTMLButtonElement;
        expect(button.querySelector('lux-progress')).not.toBeNull();
        expect(button.querySelector('lux-icon')).toBeNull();
        expect(button.getAttribute('aria-disabled')).toBe('true');

        component.items[0].loading = false;
        LuxTestHelper.wait(fixture);
        expect(button.querySelector('lux-progress')).toBeNull();
        expect(button.querySelector('lux-icon')).not.toBeNull();

        flush();
        discardPeriodicTasks();
      }));
    }
  });

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

    it('Sollte aria-disabled behalten, wenn luxDisabled zur Laufzeit von true auf false wechselt', fakeAsync(() => {
      // Regression: Das MatMenuItem-Host-Binding (aria-disabled = disabled) schreibt das
      // Attribut bei einer eigenen Wertänderung neu und würde den Direktiven-Wert überschreiben.
      component.generateItems(2);
      component.displayExtended = false;
      component.items[0].disabledAria = true;
      component.items[0].disabled = true;
      LuxTestHelper.wait(fixture);

      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      component.items[0].disabled = false;
      LuxTestHelper.wait(fixture);

      const overlayEl = overlayContainer.getContainerElement();
      const ariaDisabledItems = overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]');
      expect(ariaDisabledItems.length).toBe(1);
      expect(ariaDisabledItems[0].hasAttribute('disabled')).toBeFalse();

      flush();
      discardPeriodicTasks();
    }));

    it('Sollte aria-disabled entfernen, wenn luxDisabledAria zurückgesetzt wird', fakeAsync(() => {
      component.generateItems(2);
      component.displayExtended = false;
      component.items[0].disabledAria = true;
      LuxTestHelper.wait(fixture);

      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      component.items[0].disabledAria = false;
      LuxTestHelper.wait(fixture);

      const overlayEl = overlayContainer.getContainerElement();
      expect(overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]').length).toBe(0);

      flush();
      discardPeriodicTasks();
    }));

    it('Sollte luxHidden unverändert lassen (verstecktes Item erscheint trotz luxDisabledAria nicht im Panel)', fakeAsync(() => {
      component.generateItems(2);
      component.displayExtended = false;
      component.items[0].disabledAria = true;
      component.items[0].hidden = true;
      LuxTestHelper.wait(fixture);

      menuComponent.menuTriggerElRef!.nativeElement.click();
      LuxTestHelper.wait(fixture);

      const overlayEl = overlayContainer.getContainerElement();
      expect(overlayEl.querySelectorAll('button.lux-menu-item').length).toBe(1);
      expect(overlayEl.querySelectorAll('button.lux-menu-item[aria-disabled="true"]').length).toBe(0);

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
    [luxShowSections]="showSections"
    [luxMenuPanelLarge]="largePanel"
    (luxMenuClosed)="closed()"
  >
    @if (leadingDivider) {
      <lux-divider #menuSection></lux-divider>
    }
    @for (item of items; track item.label) {
      <lux-menu-item
        [luxLabel]="item.label"
        [luxIconName]="item.iconName"
        [luxIconShowRight]="item.iconShowRight"
        [luxTagId]="item.label"
        [luxAlwaysVisible]="item.alwaysVisible"
        [luxDisabled]="item.disabled"
        [luxDisabledAria]="item.disabledAria"
        [luxLoading]="item.loading"
        [luxHidden]="item.hidden"
        [luxRaised]="item.raised"
        [luxColor]="item.color"
        (luxClicked)="clicked()"
        (luxClickNotAllowed)="clickNotAllowed()"
        #menuSection
      >
      </lux-menu-item>
      @if (item.dividerAfter) {
        <lux-divider #menuSection></lux-divider>
      }
    }
    @if (trailingDivider) {
      <lux-divider #menuSection></lux-divider>
    }
    @if (showMockTrigger) {
      <lux-menu-trigger>
        <button class="mock-trigger">Mock-Spock</button>
      </lux-menu-trigger>
    }
  </lux-menu>`,
  imports: [LuxMenuComponent, LuxMenuItemComponent, LuxMenuTriggerComponent, LuxDividerComponent]
})
class MockComponent {
  displayMenuLeft = true;
  displayExtended = true;
  maximumExtended = 5;
  className = '';
  showSections = false;
  largePanel = false;
  showMockTrigger = false;
  leadingDivider = false;
  trailingDivider = false;

  items: {
    label: string;
    cmd?: string;
    iconName?: string;
    iconShowRight?: boolean;
    tagId: string;
    alwaysVisible: boolean;
    disabled: boolean;
    disabledAria: boolean;
    loading: boolean;
    hidden: boolean;
    raised?: boolean;
    color: LuxThemePalette;
    dividerAfter?: boolean;
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
        loading: false,
        hidden: false,
        color: 'primary'
      });
    }
  }
}
