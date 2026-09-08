// noinspection DuplicatedCode

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxLabelComponent } from '../../lux-common/lux-label/lux-label.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';

import { ChangeDetectionStrategy, Component, signal, viewChild, viewChildren } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LuxBadgeNotificationColor } from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxTabComponent } from './lux-tabs-subcomponents/lux-tab.component';
import { LuxTabsComponent } from './lux-tabs.component';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('LuxTabsComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  describe('Event "luxActiveTabChanged"', () => {
    let component: LuxActiveTabChangedTabsComponent;
    let fixture: ComponentFixture<LuxActiveTabChangedTabsComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxActiveTabChangedTabsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('ohne Animation', async () => {
      // Given
      expect(component.animated).toBe(false);
      expect(component.currentTabLabel).toBeUndefined();
      const spy = vi.spyOn(component, 'tabChanged');

      // When
      component.animated = false;
      fixture.detectChanges();

      const tabArrEl = fixture.debugElement.queryAll(By.directive(LuxIconComponent));
      tabArrEl[1].nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable().then(() => {
        // Then
        expect(spy).toHaveBeenCalledTimes(1);
        expect(component.animated).toBe(false);
        expect(component.currentTabIndex).toBe(1);
        expect(component.currentTabLabel).toBe('Tabname 2');
      });
    });
  });

  describe('Attribute "luxDisabled"', () => {
    let component: LuxTabLuxDisabledComponent;
    let fixture: ComponentFixture<LuxTabLuxDisabledComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxTabLuxDisabledComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('luxDisabled=true ohne Animation', () => {
      // Given
      let tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeFalsy();
      expect(component.disabled()).toBeFalsy();
      expect(tabEl).toBeNull();

      // When
      component.disabled.set(true);
      fixture.detectChanges();

      // Then
      tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeFalsy();
      expect(component.disabled()).toBeTruthy();
      expect(tabEl).not.toBeNull();
    });

    it('luxDisabled=true mit Animation', () => {
      // Given
      let tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeFalsy();
      expect(component.disabled()).toBeFalsy();
      expect(tabEl).toBeNull();

      // When
      component.animationActive = true;
      component.disabled.set(true);
      fixture.detectChanges();

      // Then
      tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeTruthy();
      expect(component.disabled()).toBeTruthy();
      expect(tabEl).not.toBeNull();
    });
  });

  describe('Attribute "luxLazyLoading"', () => {
    let component: LuxTabLazyLoadingComponent;
    let fixture: ComponentFixture<LuxTabLazyLoadingComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxTabLazyLoadingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('luxLazyLoading=true ohne Animation', () => {
      // Given
      expect(component.labelAaa()).not.toBeUndefined();
      expect(component.labelBbb()).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading()).toBeTruthy();
      expect(component.currentTabIndex()).toEqual(0);

      // When
      component.animationActive = false;
      component.lazyLoading.set(true);
      component.currentTabIndex.set(1);
      fixture.detectChanges();

      // Then
      expect(component.labelAaa()).toBeUndefined();
      expect(component.labelBbb()).not.toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading()).toBeTruthy();
      expect(component.currentTabIndex()).toEqual(1);
    });

    it('luxLazyLoading=true mit Animation', () => {
      // Given
      expect(component.labelAaa()).not.toBeUndefined();
      expect(component.labelBbb()).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading()).toBeTruthy();
      expect(component.currentTabIndex()).toEqual(0);

      // When
      component.animationActive = true;
      component.lazyLoading.set(true);
      component.currentTabIndex.set(1);
      fixture.detectChanges();

      // Then
      expect(component.labelAaa()).toBeUndefined();
      expect(component.labelBbb()).not.toBeUndefined();
      expect(component.animationActive).toBeTruthy();
      expect(component.lazyLoading()).toBeTruthy();
      expect(component.currentTabIndex()).toEqual(1);
    });

    it('luxLazyLoading=false ohne Animation', () => {
      // Given
      expect(component.labelAaa()).not.toBeUndefined();
      expect(component.labelBbb()).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading()).toBeTruthy();
      expect(component.currentTabIndex()).toEqual(0);

      // When
      component.animationActive = false;
      component.lazyLoading.set(false);
      component.currentTabIndex.set(1);
      fixture.detectChanges();

      // Then
      expect(component.labelAaa()).not.toBeUndefined();
      expect(component.labelBbb()).not.toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading()).toBeFalsy();
      expect(component.currentTabIndex()).toEqual(1);
    });

    it('luxLazyLoading=false mit Animation', () => {
      // Given
      expect(component.labelAaa()).not.toBeUndefined();
      expect(component.labelBbb()).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading()).toBeTruthy();
      expect(component.currentTabIndex()).toEqual(0);

      // When
      component.animationActive = true;
      component.lazyLoading.set(false);
      component.currentTabIndex.set(1);
      fixture.detectChanges();

      // Then
      expect(component.labelAaa()).not.toBeUndefined();
      expect(component.labelBbb()).not.toBeUndefined();
      expect(component.animationActive).toBeTruthy();
      expect(component.lazyLoading()).toBeFalsy();
      expect(component.currentTabIndex()).toEqual(1);
    });
  });

  describe('TAB-Wechsel', () => {
    let component: LuxMockTabsComponent;
    let fixture: ComponentFixture<LuxMockTabsComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxMockTabsComponent);
      component = fixture.componentInstance;
    });

    describe('mit Animationen', () => {
      beforeEach(() => {
        component.animated = true;
        fixture.detectChanges();
      });

      it('sollte erstellt werden', () => {
        // Given
        // When
        // Then
        expect(component).toBeTruthy();
      });

      it('sollte den Tab wechseln', async () => {
        // Given
        // When
        // Then
        expect(component.currentTabIndex()).toBeFalsy();
        expect(component.luxTabs()!.luxActiveTab()).toBeFalsy();

        // When
        component.currentTabIndex.set(1);
        fixture.detectChanges();

        await fixture.whenStable();
        expect(component.currentTabIndex()).toBe(1);
        expect(component.luxTabs()!.luxActiveTab()).toBe(1);

        component.currentTabIndex.set(2);
        fixture.detectChanges();

        await fixture.whenStable();
        // Then
        expect(component.currentTabIndex()).toBe(2);
        expect(component.luxTabs()!.luxActiveTab()).toBe(2);
      });
    });

    describe('ohne Animationen', () => {
      beforeEach(() => {
        component.animated = false;
        fixture.detectChanges();
      });

      it('sollte erstellt werden', () => {
        expect(component).toBeTruthy();
      });

      it('sollte den Tab wechseln', async () => {
        // Given
        // When
        // Then
        expect(component.currentTabIndex()).toBeFalsy();
        expect(component.luxTabs()!.luxActiveTab()).toBeFalsy();

        // When
        component.currentTabIndex.set(1);
        fixture.detectChanges();

        await fixture.whenStable();
        expect(component.currentTabIndex()).toBe(1);
        expect(component.luxTabs()!.luxActiveTab()).toBe(1);

        component.currentTabIndex.set(2);
        fixture.detectChanges();

        await fixture.whenStable();
        // Then
        expect(component.currentTabIndex()).toBe(2);
        expect(component.luxTabs()!.luxActiveTab()).toBe(2);
      });
    });
  });

  describe('mit Tabanzahlanzeige', () => {
    let fixture: ComponentFixture<LuxTabNumberComponent>;
    let testComponent: LuxTabNumberComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTabNumberComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Anzahl 0', async () => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.tabCounter()).toEqual(0);
      expect(fixture.componentInstance.tabCounterCap()).toEqual(10);

      // Nachbedingungen testen
      expect(getBadgeElement(fixture).textContent).toEqual('0');
    });

    it('Anzahl 10', async () => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.tabCounter()).toEqual(0);
      expect(fixture.componentInstance.tabCounterCap()).toEqual(10);

      // Änderungen durchführen
      fixture.componentInstance.tabCounter.set(10);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen testen
      expect(getBadgeElement(fixture).children[0].textContent).toEqual('10');
    });

    it('Anzahl 10+', async () => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.tabCounter()).toEqual(0);
      expect(fixture.componentInstance.tabCounterCap()).toEqual(10);

      // Änderungen durchführen
      fixture.componentInstance.tabCounter.set(11);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen testen
      expect(getBadgeElement(fixture).children[0].textContent).toEqual('10+');
    });
  });

  describe('ohne Tabanzahlanzeige', () => {
    let fixture: ComponentFixture<LuxTabWithoutNumberComponent>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTabWithoutNumberComponent);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Attribut "tabCounter" nicht gesetzt.', async () => {
      // Nachbedingungen testen
      expect(getBadgeElement(fixture)).toBeNull();
    });
  });

  describe('Attribut "luxNotificationColor"', () => {
    let component: LuxNotificationColorComponent;
    let fixture: ComponentFixture<LuxNotificationColorComponent>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxNotificationColorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('sollte Standard-Farbe "accent" verwenden', async () => {
      // Given
      component.showNotification.set(true);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Then
      expect(getNotificationSpan(fixture, 'lux-notification-color-accent')).not.toBeNull();
    });

    it('sollte die gesetzte Farbe als CSS-Klasse rendern', async () => {
      // Given
      component.showNotification.set(true);
      component.notificationColor.set('warn');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Then
      expect(getNotificationSpan(fixture, 'lux-notification-color-warn')).not.toBeNull();
    });

    it('sollte die CSS-Klasse bei Farbwechsel aktualisieren', async () => {
      // Given
      component.showNotification.set(true);
      component.notificationColor.set('primary');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
      expect(getNotificationSpan(fixture, 'lux-notification-color-primary')).not.toBeNull();

      // When
      component.notificationColor.set('accent');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Then
      expect(getNotificationSpan(fixture, 'lux-notification-color-accent')).not.toBeNull();
      expect(getNotificationSpan(fixture, 'lux-notification-color-primary')).toBeNull();
    });

    it('sollte "lux-notification-read" setzen, wenn luxShowNotification false ist', async () => {
      // Given
      component.showNotification.set(false);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Then
      expect(getNotificationSpan(fixture, 'lux-notification-read')).not.toBeNull();
      expect(getNotificationSpan(fixture, 'lux-notification-color-accent')).toBeNull();
    });

    it('sollte "lux-notification-read" setzen, wenn luxShowNotification undefined ist', async () => {
      // Given
      component.showNotification.set(undefined);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Then
      expect(getNotificationSpan(fixture, 'lux-notification-read')).not.toBeNull();
    });
  });
});

@Component({
  template: `
    <lux-tabs [luxActiveTab]="currentTabIndex" luxTagId="tabsID" (luxActiveTabChanged)="tabChanged($event)">
      <lux-tab luxIconName="lux-interface-user-single" luxTitle="Tabname 1">
        <ng-template> Tab-Content 0 </ng-template>
      </lux-tab>
      <lux-tab luxIconName="lux-interface-user-single" luxTitle="Tabname 2">
        <ng-template> Tab-Content 1 </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxActiveTabChangedTabsComponent {
  animated = false;
  currentTabIndex = 0;
  currentTabLabel?: string;

  readonly luxTabs = viewChild.required(LuxTabsComponent);
  readonly luxTabList = viewChildren(LuxTabComponent);

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTabIndex = tabChangeEvent.index;
    this.currentTabLabel = tabChangeEvent.tab.textLabel;
  }
}

@Component({
  selector: 'lux-mock-tabs',
  template: `<lux-tabs [luxActiveTab]="currentTabIndex()" luxTagId="tabsID" (luxActiveTabChanged)="tabChanged($event)">
    <lux-tab luxIconName="lux-interface-user-single" luxTitle="Tab-Text 0">
      <ng-template> Tab-Content 0 </ng-template>
    </lux-tab>
    <lux-tab luxIconName="lux-interface-user-single" luxTitle="Tab-Text 1">
      <ng-template> Tab-Content 1 </ng-template>
    </lux-tab>
    <lux-tab luxIconName="lux-interface-user-single" luxTitle="Tab-Text 2">
      <ng-template> Tab-Content 2 </ng-template>
    </lux-tab>
  </lux-tabs>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxMockTabsComponent {
  animated = false;
  currentTabIndex = signal(0);

  readonly luxTabs = viewChild(LuxTabsComponent);
  readonly luxTabList = viewChildren(LuxTabComponent);

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTabIndex.set(tabChangeEvent.index);
  }
}

@Component({
  template: `
    <lux-tabs luxTagId="LuxTabNumberComponent123">
      <lux-tab luxIconName="lux-ovals" luxTitle="Tabtest" [luxCounter]="tabCounter()" [luxCounterCap]="tabCounterCap()">
        <ng-template>
          <span>---</span>
        </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxTabNumberComponent {
  tabCounter = signal(0);
  tabCounterCap = signal(10);
}

@Component({
  template: `
    <lux-tabs luxTagId="LuxTabNumberComponent234">
      <lux-tab luxIconName="lux-ovals" luxTitle="Tabtest">
        <ng-template>
          <span>---</span>
        </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxTabWithoutNumberComponent {}

@Component({
  template: `
    <lux-tabs [luxActiveTab]="currentTabIndex()" [luxLazyLoading]="lazyLoading()" luxTagId="LuxTabNumberComponent234">
      <lux-tab luxTitle="Tab A">
        <ng-template>
          <lux-label luxId="AAA" #taba>AAA</lux-label>
        </ng-template>
      </lux-tab>
      <lux-tab luxTitle="Tab B">
        <ng-template>
          <lux-label luxId="BBB" #tabb>BBB</lux-label>
        </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent, LuxLabelComponent]
})
class LuxTabLazyLoadingComponent {
  readonly labelAaa = viewChild<LuxLabelComponent>('taba');
  readonly labelBbb = viewChild<LuxLabelComponent>('tabb');

  currentTabIndex = signal(0);
  animationActive = false;
  lazyLoading = signal(true);
}

@Component({
  template: `
    <lux-tabs luxTagId="LuxTabNumberComponent2345">
      <lux-tab luxTitle="Tab 1">
        <ng-template>
          <p>Lorem ipsum</p>
        </ng-template>
      </lux-tab>
      <lux-tab luxTitle="Tab 2" [luxDisabled]="disabled()">
        <ng-template>
          <p>Lorem ipsum 2</p>
        </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxTabLuxDisabledComponent {
  animationActive = false;
  disabled = signal(false);
}

@Component({
  template: `
    <lux-tabs>
      <lux-tab luxIconName="lux-ovals" [luxShowNotification]="showNotification()" [luxNotificationColor]="notificationColor()">
        <ng-template><span>Inhalt</span></ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxNotificationColorComponent {
  showNotification = signal<boolean | undefined>(undefined);
  notificationColor = signal<LuxBadgeNotificationColor>('accent');
}

function getNotificationSpan(fixture: ComponentFixture<any>, colorClass: string): any {
  const found = fixture.debugElement.query(By.css(`.lux-tabs-notification-icon-position-after-icon.${colorClass}`));
  return found ? found.nativeElement : null;
}

function getBadgeElement(fixture: ComponentFixture<any>): any {
  // jsdom hat kein reales Layout: document.body.clientWidth ist immer 0, wodurch eine
  // Breakpoint-abhängige Auswahl (Desktop: Titel-Badge, Mobil: Icon-Badge) hier nicht auswertbar
  // ist. Je nach smallDevice()-Status der Komponente ist nur einer der beiden Selektoren befüllt,
  // daher werden beide abgefragt und der tatsächlich vorhandene genommen.
  const found = fixture.debugElement.query(By.css('.lux-tab-title .mat-badge-content, .lux-tab-icon .mat-badge-content'));
  return found ? found.nativeElement : null;
}
