// noinspection DuplicatedCode

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxLabelComponent } from '../../lux-common/lux-label/lux-label.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';

import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LuxTabComponent } from './lux-tabs-subcomponents/lux-tab.component';
import { LuxTabsComponent } from './lux-tabs.component';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('LuxTabsComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  describe('Event "luxActiveTabChanged"', () => {
    let component: LuxActiveTabChangedTabsComponent;
    let fixture: ComponentFixture<LuxActiveTabChangedTabsComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxActiveTabChangedTabsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('ohne Animation', (done: DoneFn) => {
      // Given
      expect(component.animated).toBe(false);
      expect(component.currentTabLabel).toBeUndefined();
      const spy = spyOn(component, 'tabChanged').and.callThrough();

      // When
      component.animated = false;
      fixture.detectChanges();

      const tabArrEl = fixture.debugElement.queryAll(By.directive(LuxIconComponent));
      tabArrEl[1].nativeElement.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        // Then
        expect(spy).toHaveBeenCalledTimes(1);
        expect(component.animated).toBe(false);
        expect(component.currentTabIndex).toBe(1);
        expect(component.currentTabLabel).toBe('Tabname 2');

        done();
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
      expect(component.disabled).toBeFalsy();
      expect(tabEl).toBeNull();

      // When
      component.disabled = true;
      fixture.detectChanges();

      // Then
      tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeFalsy();
      expect(component.disabled).toBeTruthy();
      expect(tabEl).not.toBeNull();
    });

    it('luxDisabled=true mit Animation', () => {
      // Given
      let tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeFalsy();
      expect(component.disabled).toBeFalsy();
      expect(tabEl).toBeNull();

      // When
      component.animationActive = true;
      component.disabled = true;
      fixture.detectChanges();

      // Then
      tabEl = fixture.debugElement.query(By.css('.mat-mdc-tab-disabled'));
      expect(component.animationActive).toBeTruthy();
      expect(component.disabled).toBeTruthy();
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
      expect(component.labelAaa).not.toBeUndefined();
      expect(component.labelBbb).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading).toBeTruthy();
      expect(component.currentTabIndex).toEqual(0);

      // When
      component.animationActive = false;
      component.lazyLoading = true;
      component.currentTabIndex = 1;
      fixture.detectChanges();

      // Then
      expect(component.labelAaa).toBeUndefined();
      expect(component.labelBbb).not.toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading).toBeTruthy();
      expect(component.currentTabIndex).toEqual(1);
    });

    it('luxLazyLoading=true mit Animation', () => {
      // Given
      expect(component.labelAaa).not.toBeUndefined();
      expect(component.labelBbb).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading).toBeTruthy();
      expect(component.currentTabIndex).toEqual(0);

      // When
      component.animationActive = true;
      component.lazyLoading = true;
      component.currentTabIndex = 1;
      fixture.detectChanges();

      // Then
      expect(component.labelAaa).toBeUndefined();
      expect(component.labelBbb).not.toBeUndefined();
      expect(component.animationActive).toBeTruthy();
      expect(component.lazyLoading).toBeTruthy();
      expect(component.currentTabIndex).toEqual(1);
    });

    it('luxLazyLoading=false ohne Animation', () => {
      // Given
      expect(component.labelAaa).not.toBeUndefined();
      expect(component.labelBbb).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading).toBeTruthy();
      expect(component.currentTabIndex).toEqual(0);

      // When
      component.animationActive = false;
      component.lazyLoading = false;
      component.currentTabIndex = 1;
      fixture.detectChanges();

      // Then
      expect(component.labelAaa).not.toBeUndefined();
      expect(component.labelBbb).not.toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading).toBeFalsy();
      expect(component.currentTabIndex).toEqual(1);
    });

    it('luxLazyLoading=false mit Animation', () => {
      // Given
      expect(component.labelAaa).not.toBeUndefined();
      expect(component.labelBbb).toBeUndefined();
      expect(component.animationActive).toBeFalsy();
      expect(component.lazyLoading).toBeTruthy();
      expect(component.currentTabIndex).toEqual(0);

      // When
      component.animationActive = true;
      component.lazyLoading = false;
      component.currentTabIndex = 1;
      fixture.detectChanges();

      // Then
      expect(component.labelAaa).not.toBeUndefined();
      expect(component.labelBbb).not.toBeUndefined();
      expect(component.animationActive).toBeTruthy();
      expect(component.lazyLoading).toBeFalsy();
      expect(component.currentTabIndex).toEqual(1);
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
        expect(component).toBeTruthy('Die LuxMockTabsComponent (animiert) konnte nicht erzeugt werden.');
      });

      it('sollte den Tab wechseln', (done: DoneFn) => {
        // Given
        // When
        // Then
        expect(component.currentTabIndex).toBeFalsy();
        expect(component.luxTabs!.luxActiveTab).toBeUndefined();

        // When
        component.currentTabIndex = 1;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(component.currentTabIndex).toBe(1);
          expect(component.luxTabs!.luxActiveTab).toBe(1);

          component.currentTabIndex = 2;
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            // Then
            expect(component.currentTabIndex).toBe(2);
            expect(component.luxTabs!.luxActiveTab).toBe(2);
            done();
          });
        });
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

      it('sollte den Tab wechseln', (done: DoneFn) => {
        // Given
        // When
        // Then
        expect(component.currentTabIndex).toBeFalsy();
        expect(component.luxTabs!.luxActiveTab).toBeUndefined();

        // When
        component.currentTabIndex = 1;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(component.currentTabIndex).toBe(1);
          expect(component.luxTabs!.luxActiveTab).toBe(1);

          component.currentTabIndex = 2;
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            // Then
            expect(component.currentTabIndex).toBe(2);
            expect(component.luxTabs!.luxActiveTab).toBe(2);
            done();
          });
        });
      });
    });
  });

  describe('mit Tabanzahlanzeige', () => {
    let fixture: ComponentFixture<LuxTabNumberComponent>;
    let testComponent: LuxTabNumberComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxTabNumberComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      flush();
    }));

    it('Anzahl 0', fakeAsync(() => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.tabCounter).toEqual(0);
      expect(fixture.componentInstance.tabCounterCap).toEqual(10);

      // Nachbedingungen testen
      expect(getBadgeElement(fixture).textContent).toEqual('0');
    }));

    it('Anzahl 10', fakeAsync(() => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.tabCounter).toEqual(0);
      expect(fixture.componentInstance.tabCounterCap).toEqual(10);

      // Änderungen durchführen
      fixture.componentInstance.tabCounter = 10;
      tick();
      fixture.detectChanges();
      flush();

      // Nachbedingungen testen
      expect(getBadgeElement(fixture).children[0].textContent).toEqual('10');
    }));

    it('Anzahl 10+', fakeAsync(() => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.tabCounter).toEqual(0);
      expect(fixture.componentInstance.tabCounterCap).toEqual(10);

      // Änderungen durchführen
      fixture.componentInstance.tabCounter = 11;
      tick();
      fixture.detectChanges();
      flush();

      // Nachbedingungen testen
      expect(getBadgeElement(fixture).children[0].textContent).toEqual('10+');
    }));
  });

  describe('ohne Tabanzahlanzeige', () => {
    let fixture: ComponentFixture<LuxTabWithoutNumberComponent>;
    let testComponent: LuxTabWithoutNumberComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxTabWithoutNumberComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      flush();
    }));

    it('Attribut "tabCounter" nicht gesetzt.', fakeAsync(() => {
      // Nachbedingungen testen
      expect(getBadgeElement(fixture)).toBeNull();
    }));
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
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxActiveTabChangedTabsComponent {
  animated = false;
  currentTabIndex?: number;
  currentTabLabel?: string;

  @ViewChild(LuxTabsComponent) luxTabs!: LuxTabsComponent;
  @ViewChildren(LuxTabComponent) luxTabList!: QueryList<LuxTabComponent>;

  constructor() {}

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTabIndex = tabChangeEvent.index;
    this.currentTabLabel = tabChangeEvent.tab.textLabel;
  }
}

@Component({
  selector: 'lux-mock-tabs',
  template: `<lux-tabs [luxActiveTab]="currentTabIndex" luxTagId="tabsID" (luxActiveTabChanged)="tabChanged($event)">
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
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxMockTabsComponent {
  animated = false;
  currentTabIndex?: number;

  @ViewChild(LuxTabsComponent) luxTabs?: LuxTabsComponent;
  @ViewChildren(LuxTabComponent) luxTabList!: QueryList<LuxTabComponent>;

  constructor() {}

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.currentTabIndex = tabChangeEvent.index;
  }
}

@Component({
  template: `
    <lux-tabs luxTagId="LuxTabNumberComponent123">
      <lux-tab luxIconName="lux-ovals" luxTitle="Tabtest" [luxCounter]="tabCounter" [luxCounterCap]="tabCounterCap">
        <ng-template>
          <span>---</span>
        </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxTabNumberComponent {
  tabCounter = 0;
  tabCounterCap = 10;
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
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxTabWithoutNumberComponent {}

@Component({
  template: `
    <lux-tabs [luxActiveTab]="currentTabIndex" [luxLazyLoading]="lazyLoading" luxTagId="LuxTabNumberComponent234">
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
  imports: [LuxTabsComponent, LuxTabComponent, LuxLabelComponent]
})
class LuxTabLazyLoadingComponent {
  @ViewChild('taba') labelAaa!: LuxLabelComponent;
  @ViewChild('tabb') labelBbb!: LuxLabelComponent;

  currentTabIndex = 0;
  animationActive = false;
  lazyLoading = true;
}

@Component({
  template: `
    <lux-tabs luxTagId="LuxTabNumberComponent2345">
      <lux-tab luxTitle="Tab 1">
        <ng-template>
          <p>Lorem ipsum</p>
        </ng-template>
      </lux-tab>
      <lux-tab luxTitle="Tab 2" [luxDisabled]="disabled">
        <ng-template>
          <p>Lorem ipsum 2</p>
        </ng-template>
      </lux-tab>
    </lux-tabs>
  `,
  imports: [LuxTabsComponent, LuxTabComponent]
})
class LuxTabLuxDisabledComponent {
  animationActive = false;
  disabled = false;
}

/**
 * @param fixture
 */
export function getBadgeElement(fixture: ComponentFixture<any>): any {
  let badgeSelector: string;
  if (document.body.clientWidth > 959) {
    badgeSelector = '.lux-tab-title .mat-badge-content';
  } else {
    badgeSelector = '.lux-tab-icon .mat-badge-content';
  }

  const found = fixture.debugElement.query(By.css(badgeSelector));
  return found ? found.nativeElement : null;
}
