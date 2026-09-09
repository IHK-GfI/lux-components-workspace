// noinspection DuplicatedCode

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxAccordionColor } from '../../lux-util/lux-colors.enum';
import { LuxPanelContentComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderTitleComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxPanelComponent } from '../lux-panel/lux-panel.component';
import { LuxAccordionComponent, LuxTogglePosition } from './lux-accordion.component';

describe('LuxAccordionComponent', () => {
  describe('Attribut "luxCollapsedHeaderHeight" und "luxExpandedHeaderHeight"', () => {
    describe('Höhe über das Accordion gesetzt"', () => {
      let fixture: ComponentFixture<LuxAccordionHeightComponent>;
      let testComponent: LuxAccordionHeightComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionHeightComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Höhe prüfen', async () => {
        // Vorbedingungen testen
        const panel1HeaderEl = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'))[0];
        expect('150px').toEqual(panel1HeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        panel1HeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect('100px').toEqual(panel1HeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        panel1HeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect('150px').toEqual(panel1HeaderEl.nativeElement.style.height);
      });

      it('Höhe verändern und prüfen', async () => {
        // Vorbedingungen testen
        const panel1HeaderEl = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'))[0];
        expect('150px').toEqual(panel1HeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        const expectedCollapsedHeight = '200px';
        const expectedExpandedHeight = '250px';
        fixture.componentInstance.collapsedHeaderHeight.set(expectedCollapsedHeight);
        fixture.componentInstance.expandedHeaderHeight.set(expectedExpandedHeight);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen.
        // Geschlossenes Panel
        expect(expectedCollapsedHeight).toEqual(panel1HeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        panel1HeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen.
        // Geöffnetes Panel
        expect(expectedExpandedHeight).toEqual(panel1HeaderEl.nativeElement.style.height);
      });

      it('Panel über *ngIf einblenden', async () => {
        // Vorbedingungen testen
        const headerElemente = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
        expect(1).toEqual(headerElemente.length);

        // Änderungen durchführen
        fixture.componentInstance.visible.set(true);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newHeaderElemente = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
        expect(2).toEqual(newHeaderElemente.length);
        const newPanelHeaderEl = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'))[1];
        expect('150px').toEqual(newPanelHeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        newPanelHeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect('100px').toEqual(newPanelHeaderEl.nativeElement.style.height);
      });
    });

    describe('Höhe des Accordions im Panel überschreiben', () => {
      let fixture: ComponentFixture<LuxAccordionPanelOverrideHeightComponent>;
      let testComponent: LuxAccordionPanelOverrideHeightComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionPanelOverrideHeightComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Höhe prüfen', async () => {
        // Vorbedingungen testen
        const panel1HeaderEl = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'))[0];
        expect('110px').toEqual(panel1HeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        panel1HeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect('120px').toEqual(panel1HeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        panel1HeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect('110px').toEqual(panel1HeaderEl.nativeElement.style.height);
      });

      it('Panel über *ngIf einblenden', async () => {
        // Vorbedingungen testen
        const headerElemente = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
        expect(1).toEqual(headerElemente.length);

        // Änderungen durchführen
        fixture.componentInstance.visible.set(true);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newHeaderElemente = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
        expect(2).toEqual(newHeaderElemente.length);
        const newPanelHeaderEl = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'))[1];
        expect('110px').toEqual(newPanelHeaderEl.nativeElement.style.height);

        // Änderungen durchführen
        newPanelHeaderEl.nativeElement.click();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect('120px').toEqual(newPanelHeaderEl.nativeElement.style.height);
      });
    });
  });

  describe('Attribut "luxMulti"', () => {
    let fixture: ComponentFixture<LuxAccordionPanelMultiComponent>;
    let testComponent: LuxAccordionPanelMultiComponent;

    beforeEach(async () => {
      vi.useFakeTimers();
      fixture = TestBed.createComponent(LuxAccordionPanelMultiComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    afterEach(async () => {
      if (vi.isFakeTimers()) {
        await vi.runAllTimersAsync();
      }
      vi.useRealTimers();
    });

    it('Mehrere Bereiche dürfen geöffnet sein', async () => {
      // Vorbedingungen testen
      expect(true).toEqual(fixture.componentInstance.multi());
      const items = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
      expect(2).toEqual(items.length);
      expect(items[0].classes['mat-expanded']).toBeFalsy();
      expect(items[1].classes['mat-expanded']).toBeFalsy();

      // Änderungen durchführen
      const headerElemente = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
      headerElemente[0].nativeElement.click();
      await LuxTestHelper.wait(fixture);
      headerElemente[1].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(items[0].classes['mat-expanded']).toBeTruthy();
      expect(items[1].classes['mat-expanded']).toBeTruthy();
    });

    it('Nur ein Bereich darf geöffnet sein', async () => {
      // Vorbedingungen testen
      expect(true).toEqual(fixture.componentInstance.multi());
      const items = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
      expect(2).toEqual(items.length);
      expect(items[0].classes['mat-expanded']).toBeFalsy();
      expect(items[1].classes['mat-expanded']).toBeFalsy();

      // Änderungen durchführen
      fixture.componentInstance.multi.set(false);
      const headerElemente = fixture.debugElement.queryAll(By.css('mat-expansion-panel-header'));
      headerElemente[0].nativeElement.click();
      await LuxTestHelper.wait(fixture);
      headerElemente[1].nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(items[0].classes['mat-expanded']).toBeFalsy();
      expect(items[1].classes['mat-expanded']).toBeTruthy();
    });
  });

  describe('Attribut "luxHideToggle"', () => {
    describe('Toggle über das Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionHideToggleComponent>;
      let testComponent: LuxAccordionHideToggleComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionHideToggleComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Toggle prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.hide()).toBeFalsy();
        const toggleEl = fixture.debugElement.query(By.css('.mat-expansion-indicator'));
        expect(toggleEl).not.toBeNull();

        // Änderungen durchführen
        fixture.componentInstance.hide.set(true);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newToggleEl = fixture.debugElement.query(By.css('.mat-expansion-indicator'));
        expect(newToggleEl).toBeNull();
      });
    });

    describe('Toggle initial true über Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionHideToggleTrueComponent>;
      let testComponent: LuxAccordionHideToggleTrueComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionHideToggleTrueComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Toggle prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.hide()).toBeTruthy();
        const toggleEl = fixture.debugElement.query(By.css('.mat-expansion-indicator'));
        expect(toggleEl).toBeNull();

        // Änderungen durchführen
        fixture.componentInstance.hide.set(false);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newToggleEl = fixture.debugElement.query(By.css('.mat-expansion-indicator'));
        expect(newToggleEl).not.toBeNull();
      });
    });

    describe('Toggle des Accordions im Panel überschreiben', () => {
      let fixture: ComponentFixture<LuxAccordionOverrideHideToggleComponent>;
      let testComponent: LuxAccordionOverrideHideToggleComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionOverrideHideToggleComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Toggle prüfen', async () => {
        const toggleEl = fixture.debugElement.query(By.css('#panel1 .mat-expansion-indicator'));
        expect(toggleEl).not.toBeNull();
        const toggle2El = fixture.debugElement.query(By.css('#panel2 .mat-expansion-indicator'));
        expect(toggle2El).toBeNull();
      });
    });
  });

  describe('Attribut "luxDisabled"', () => {
    describe('Disabled über das Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionDisabledComponent>;
      let testComponent: LuxAccordionDisabledComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionDisabledComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Disabled prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.disabled()).toBeFalsy();
        const headerEl = fixture.debugElement.query(By.css('.mat-expansion-panel-header'));
        expect(headerEl.nativeElement.attributes['aria-disabled'].value).toEqual('false');

        // Änderungen durchführen
        fixture.componentInstance.disabled.set(true);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(headerEl.nativeElement.attributes['aria-disabled'].value).toEqual('true');
      });
    });

    describe('Disabled initial true über das Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionDisabledTrueComponent>;
      let testComponent: LuxAccordionDisabledTrueComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionDisabledTrueComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Disabled prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.disabled()).toBeTruthy();
        const headerEl = fixture.debugElement.query(By.css('.mat-expansion-panel-header'));
        expect(headerEl.nativeElement.attributes['aria-disabled'].value).toEqual('true');

        // Änderungen durchführen
        fixture.componentInstance.disabled.set(false);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(headerEl.nativeElement.attributes['aria-disabled'].value).toEqual('false');
      });
    });

    describe('Disabled des Accordions im Panel überschreiben', () => {
      let fixture: ComponentFixture<LuxAccordionOverrideDisabledComponent>;
      let testComponent: LuxAccordionOverrideDisabledComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionOverrideDisabledComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Disabled prüfen', async () => {
        const headerEl = fixture.debugElement.query(By.css('#panel1 .mat-expansion-panel-header'));
        expect(headerEl.nativeElement.attributes['aria-disabled'].value).toEqual('false');
        const header2El = fixture.debugElement.query(By.css('#panel2 .mat-expansion-panel-header'));
        expect(header2El.nativeElement.attributes['aria-disabled'].value).toEqual('true');
      });
    });
  });

  describe('Disabled des Accordions im Panel umgedreht überschreiben', () => {
    let fixture: ComponentFixture<LuxAccordionOverrideDisabledReversedComponent>;
    let testComponent: LuxAccordionOverrideDisabledReversedComponent;

    beforeEach(async () => {
      vi.useFakeTimers();
      fixture = TestBed.createComponent(LuxAccordionOverrideDisabledReversedComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    afterEach(async () => {
      if (vi.isFakeTimers()) {
        await vi.runAllTimersAsync();
      }
      vi.useRealTimers();
    });

    it('Disabled prüfen', async () => {
      const headerEl = fixture.debugElement.query(By.css('#panel1 .mat-expansion-panel-header'));
      expect(headerEl.nativeElement.attributes['aria-disabled'].value).toEqual('true');
      const header2El = fixture.debugElement.query(By.css('#panel2 .mat-expansion-panel-header'));
      expect(header2El.nativeElement.attributes['aria-disabled'].value).toEqual('false');
    });
  });

  describe('Attribut "luxTogglePosition"', () => {
    describe('TogglePosition über das Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionluxTogglePositionComponent>;
      let testComponent: LuxAccordionluxTogglePositionComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionluxTogglePositionComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('TogglePosition prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.togglePosition()).toBe('after');
        const positionEl = fixture.debugElement.query(By.css('.mat-expansion-toggle-indicator-after'));
        expect(positionEl).not.toBeNull();

        // Änderungen durchführen
        fixture.componentInstance.togglePosition.set('before');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newPositionEl = fixture.debugElement.query(By.css('.mat-expansion-toggle-indicator-before'));
        expect(newPositionEl).not.toBeNull();
      });
    });

    describe('TogglePosition initial "before" über das Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionluxTogglePositionBeforeComponent>;
      let testComponent: LuxAccordionluxTogglePositionBeforeComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionluxTogglePositionBeforeComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('TogglePosition prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.togglePosition()).toBe('before');
        const positionEl = fixture.debugElement.query(By.css('.mat-expansion-toggle-indicator-before'));
        expect(positionEl).not.toBeNull();

        // Änderungen durchführen
        fixture.componentInstance.togglePosition.set('after');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newPositionEl = fixture.debugElement.query(By.css('.mat-expansion-toggle-indicator-after'));
        expect(newPositionEl).not.toBeNull();
      });
    });

    describe('TogglePosition in Panels überschrieben', () => {
      let fixture: ComponentFixture<LuxAccordionOverrideluxTogglePositionComponent>;
      let testComponent: LuxAccordionOverrideluxTogglePositionComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionOverrideluxTogglePositionComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('TogglePosition prüfen', async () => {
        const positionEl = fixture.debugElement.query(By.css('#panel1 .mat-expansion-toggle-indicator-after'));
        expect(positionEl).not.toBeNull();
        const positionTwoEl = fixture.debugElement.query(By.css('#panel2 .mat-expansion-toggle-indicator-before'));
        expect(positionTwoEl).not.toBeNull();
      });
    });

    describe('TogglePosition in Panels überschrieben umgedreht', () => {
      let fixture: ComponentFixture<LuxAccordionOverridePanelReversedluxTogglePositionComponent>;
      let testComponent: LuxAccordionOverridePanelReversedluxTogglePositionComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionOverridePanelReversedluxTogglePositionComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('TogglePosition prüfen', async () => {
        const positionEl = fixture.debugElement.query(By.css('#panel1 .mat-expansion-toggle-indicator-before'));
        expect(positionEl).not.toBeNull();
        const positionTwoEl = fixture.debugElement.query(By.css('#panel2 .mat-expansion-toggle-indicator-after'));
        expect(positionTwoEl).not.toBeNull();
      });
    });
  });

  describe('Attribut "luxColor"', () => {
    describe('Color im Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionColorComponent>;
      let testComponent: LuxAccordionColorComponent;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionColorComponent);
        await LuxTestHelper.wait(fixture);
        testComponent = fixture.componentInstance;
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Color prüfen', async () => {
        // Vorbedingungen testen
        expect(fixture.componentInstance.color()).toBe('primary');
        const toggleEl = fixture.debugElement.query(By.css('.lux-primary'));
        expect(toggleEl).not.toBeNull();

        // Änderungen auf accent durchführen
        fixture.componentInstance.color.set('accent');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newToggleEl = fixture.debugElement.query(By.css('.lux-accent'));
        expect(newToggleEl).not.toBeNull();

        // Änderungen auf warn durchführen
        fixture.componentInstance.color.set('warn');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newToggleEl2 = fixture.debugElement.query(By.css('.lux-warn'));
        expect(newToggleEl2).not.toBeNull();

        // Änderungen auf neutral durchführen
        fixture.componentInstance.color.set('neutral');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const newToggleEl3 = fixture.debugElement.query(By.css('.lux-neutral'));
        expect(newToggleEl3).not.toBeNull();
      });
    });
  });

  describe('Attribut "luxStickyHeader"', () => {
    describe('Sticky über das Accordion gesetzt', () => {
      let fixture: ComponentFixture<LuxAccordionStickyHeaderComponent>;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionStickyHeaderComponent);
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Vererbung und nachträgliche Änderung prüfen', async () => {
        // Vorbedingungen testen
        const panelEl = fixture.debugElement.query(By.css('.mat-expansion-panel'));
        expect(panelEl.classes['lux-panel-sticky-header']).toBeFalsy();

        // Änderungen durchführen
        fixture.componentInstance.sticky.set(true);
        fixture.componentInstance.offset.set('48px');
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(panelEl.classes['lux-panel-sticky-header']).toBeTruthy();
        expect(panelEl.nativeElement.style.getPropertyValue('--lux-panel-sticky-header-offset')).toBe('48px');
      });
    });

    describe('Sticky des Accordions im Panel überschreiben', () => {
      let fixture: ComponentFixture<LuxAccordionOverrideStickyHeaderComponent>;

      beforeEach(async () => {
        vi.useFakeTimers();
        fixture = TestBed.createComponent(LuxAccordionOverrideStickyHeaderComponent);
        await LuxTestHelper.wait(fixture);
      });

      afterEach(async () => {
        if (vi.isFakeTimers()) {
          await vi.runAllTimersAsync();
        }
        vi.useRealTimers();
      });

      it('Sticky prüfen', async () => {
        const panel1El = fixture.debugElement.query(By.css('#panel1 .mat-expansion-panel'));
        expect(panel1El.classes['lux-panel-sticky-header']).toBeFalsy();
        const panel2El = fixture.debugElement.query(By.css('#panel2 .mat-expansion-panel'));
        expect(panel2El.classes['lux-panel-sticky-header']).toBeTruthy();
      });
    });
  });
});

@Component({
  template: `
    <lux-button (luxClicked)="visible.set(!visible())" luxLabel="Toggle"></lux-button>

    <lux-accordion [luxCollapsedHeaderHeight]="collapsedHeaderHeight()" [luxExpandedHeaderHeight]="expandedHeaderHeight()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      @if (visible()) {
        <lux-panel>
          <lux-panel-header-title>Titel 2</lux-panel-header-title>
          <lux-panel-content> 2222222 </lux-panel-content>
        </lux-panel>
      }
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionHeightComponent {
  collapsedHeaderHeight = signal('150px');
  expandedHeaderHeight = signal('100px');
  visible = signal(false);
}

@Component({
  template: `
    <lux-button (luxClicked)="visible.set(!visible())" luxLabel="Toggle"></lux-button>

    <lux-accordion luxCollapsedHeaderHeight="150px" luxExpandedHeaderHeight="100px">
      <lux-panel luxCollapsedHeaderHeight="110px" luxExpandedHeaderHeight="120px">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      @if (visible()) {
        <lux-panel luxCollapsedHeaderHeight="110px" luxExpandedHeaderHeight="120px">
          <lux-panel-header-title>Titel 2</lux-panel-header-title>
          <lux-panel-content> 2222222 </lux-panel-content>
        </lux-panel>
      }
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionPanelOverrideHeightComponent {
  visible = signal(false);
}

@Component({
  template: `
    <lux-button (luxClicked)="multi.set(!multi())" luxLabel="Toggle"></lux-button>

    <lux-accordion [luxMulti]="multi()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel>
        <lux-panel-header-title>Titel 2</lux-panel-header-title>
        <lux-panel-content> 2222222 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionPanelMultiComponent {
  multi = signal(true);
}

@Component({
  selector: 'lux-accordion-hidetoggle-false',
  template: `
    <lux-accordion [luxHideToggle]="hide()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionHideToggleComponent {
  hide = signal(false);
}

@Component({
  selector: 'lux-accordion-hidetoggle-true',
  template: `
    <lux-accordion [luxHideToggle]="hide()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionHideToggleTrueComponent {
  hide = signal(true);
}

@Component({
  template: `
    <lux-accordion [luxHideToggle]="true">
      <lux-panel id="panel1" [luxHideToggle]="false">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel id="panel2">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionOverrideHideToggleComponent {}

@Component({
  selector: 'lux-accordion-disabled-false',
  template: `
    <lux-accordion [luxDisabled]="disabled()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionDisabledComponent {
  disabled = signal(false);
}

@Component({
  selector: 'lux-accordion-disabled-true',
  template: `
    <lux-accordion [luxDisabled]="disabled()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionDisabledTrueComponent {
  disabled = signal(true);
}

@Component({
  template: `
    <lux-accordion [luxDisabled]="true">
      <lux-panel id="panel1" [luxDisabled]="false">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel id="panel2">
        <lux-panel-header-title>Titel 2</lux-panel-header-title>
        <lux-panel-content> 22222222 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionOverrideDisabledComponent {}

@Component({
  selector: 'lux-accordion-override-disabled-reversed',
  template: `
    <lux-accordion [luxDisabled]="false">
      <lux-panel id="panel1" [luxDisabled]="true">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel id="panel2">
        <lux-panel-header-title>Titel 2</lux-panel-header-title>
        <lux-panel-content> 22222222 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionOverrideDisabledReversedComponent {}

@Component({
  selector: 'lux-toggleposition-after',
  template: `
    <lux-accordion [luxTogglePosition]="togglePosition()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionluxTogglePositionComponent {
  togglePosition = signal<LuxTogglePosition>('after');
}

@Component({
  selector: 'lux-toggleposition-before',
  template: `
    <lux-accordion [luxTogglePosition]="togglePosition()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionluxTogglePositionBeforeComponent {
  togglePosition = signal<LuxTogglePosition>('before');
}

@Component({
  selector: 'lux-accordion-override-luxtoggleposition-component',
  template: `
    <lux-accordion [luxTogglePosition]="'after'">
      <lux-panel id="panel1">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel [luxTogglePosition]="'before'" id="panel2">
        <lux-panel-header-title>Titel 2</lux-panel-header-title>
        <lux-panel-content> 22222222 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionOverrideluxTogglePositionComponent {}

@Component({
  selector: 'lux-accordion-override-panel-reversed-luxtoggleposition-component',
  template: `
    <lux-accordion [luxTogglePosition]="'before'">
      <lux-panel id="panel1">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel [luxTogglePosition]="'after'" id="panel2">
        <lux-panel-header-title>Titel 2</lux-panel-header-title>
        <lux-panel-content> 22222222 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionOverridePanelReversedluxTogglePositionComponent {}

@Component({
  selector: 'lux-accordion-override-panel-reversed-luxtoggleposition-component',
  template: `
    <lux-accordion [luxColor]="color()">
      <lux-panel>
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionColorComponent {
  color = signal<LuxAccordionColor>('primary');
}

@Component({
  selector: 'lux-accordion-sticky-header',
  template: `
    <lux-accordion [luxStickyHeader]="sticky()" [luxStickyHeaderOffset]="offset()">
      <lux-panel [luxExpanded]="true">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionStickyHeaderComponent {
  sticky = signal(false);
  offset = signal<string | undefined>(undefined);
}

@Component({
  selector: 'lux-accordion-override-sticky-header',
  template: `
    <lux-accordion [luxStickyHeader]="true">
      <lux-panel id="panel1" [luxStickyHeader]="false">
        <lux-panel-header-title>Titel 1</lux-panel-header-title>
        <lux-panel-content> 111111 </lux-panel-content>
      </lux-panel>
      <lux-panel id="panel2">
        <lux-panel-header-title>Titel 2</lux-panel-header-title>
        <lux-panel-content> 22222222 </lux-panel-content>
      </lux-panel>
    </lux-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent]
})
class LuxAccordionOverrideStickyHeaderComponent {}
