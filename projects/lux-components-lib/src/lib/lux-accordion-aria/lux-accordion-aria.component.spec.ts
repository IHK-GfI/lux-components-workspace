// noinspection DuplicatedCode

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxAccordionAriaComponent } from './lux-accordion-aria.component';
import { LuxPanelAriaComponent } from '../lux-panel-aria/lux-panel-aria.component';
import { LuxPanelAriaContentComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-content.component';
import { LuxPanelAriaHeaderCustomComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-custom.component';
import { LuxPanelAriaHeaderTitleComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-title.component';

describe('LuxAccordionAriaComponent', () => {
  describe('Basis-Funktionalität', () => {
    let fixture: ComponentFixture<LuxAccordionAriaTestComponent>;
    let testComponent: LuxAccordionAriaTestComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          LuxAccordionAriaComponent,
          LuxPanelAriaComponent,
          LuxPanelAriaHeaderTitleComponent,
          LuxPanelAriaHeaderCustomComponent,
          LuxPanelAriaContentComponent,
          LuxAccordionAriaTestComponent,
          LuxAccordionAriaCustomHeaderTestComponent
        ]
      });
      fixture = TestBed.createComponent(LuxAccordionAriaTestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      // tick();
      // fixture.detectChanges();
    }));

    it('sollte erstellt werden', () => {
      expect(testComponent).toBeTruthy();
    });

    it('sollte luxTogglePosition auf alle Panels ohne Custom Header anwenden', fakeAsync(() => {
      const headerButtons = fixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle'));

      expect(headerButtons.length).toBe(2);
      headerButtons.forEach((headerButton) => {
        expect(headerButton.nativeElement.classList.contains('lux-expansion-toggle-indicator-before')).toBeFalse();
        expect(headerButton.query(By.css('.lux-expansion-indicator-after'))).toBeTruthy();
      });

      testComponent.togglePosition = 'before';
      LuxTestHelper.wait(fixture);

      fixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle')).forEach((headerButton) => {
        expect(headerButton.nativeElement.classList.contains('lux-expansion-toggle-indicator-before')).toBeTrue();
        expect(headerButton.query(By.css('.lux-expansion-indicator-before'))).toBeTruthy();
        expect(headerButton.query(By.css('.lux-expansion-indicator-after'))).toBeFalsy();
      });
    }));

    it('sollte die luxMulti-Eigenschaft respektieren', fakeAsync(() => {
      testComponent.multi = false;
      LuxTestHelper.wait(fixture);

      const accordionComponent = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
      expect(accordionComponent.luxMulti()).toBe(false);

      testComponent.multi = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(accordionComponent.luxMulti()).toBe(true);
    }));

    it('sollte bei luxMulti=false nur ein Panel gleichzeitig geöffnet lassen', fakeAsync(() => {
      const headerButtons = fixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle'));

      headerButtons[0].nativeElement.click();
      fixture.detectChanges();
      tick();

      headerButtons[1].nativeElement.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const openContents = fixture.debugElement.queryAll(By.css('.lux-expansion-panel-content'));
      expect(openContents.length).toBe(1);
      expect(openContents[0].nativeElement.textContent).toContain('Content 2');
    }));

    it('sollte die luxDisabled-Eigenschaft respektieren', fakeAsync(() => {
      const accordionComponent = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
      expect(accordionComponent.luxDisabled()).toBeFalsy();

      testComponent.disabled = true;
      LuxTestHelper.wait(fixture);

      expect(accordionComponent.luxDisabled()).toBe(true);
    }));

    it('sollte Farben-CSS-Klassen anwenden', fakeAsync(() => {
      const accordion = fixture.debugElement.query(By.css('lux-accordion-aria > div'));

      testComponent.color = 'primary';
      LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-primary')).toBe(true);

      testComponent.color = 'accent';
      LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-accent')).toBe(true);

      testComponent.color = 'warn';
      LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-warn')).toBe(true);

      testComponent.color = 'neutral';
      LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-neutral')).toBe(true);
    }));

    it('sollte den Abstand im flat-Modus deaktivieren', fakeAsync(() => {
      const accordion = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent));

      expect(accordion.nativeElement.classList.contains('lux-default')).toBe(true);
      expect(accordion.nativeElement.classList.contains('lux-flat')).toBe(false);

      testComponent.mode = 'flat';
      LuxTestHelper.wait(fixture);

      expect(accordion.nativeElement.classList.contains('lux-default')).toBe(false);
      expect(accordion.nativeElement.classList.contains('lux-flat')).toBe(true);
    }));

    describe('Custom Header', () => {
      it('sollte bei einem Custom Header die Toggle-Position auf before setzen', fakeAsync(() => {
        const customFixture = TestBed.createComponent(LuxAccordionAriaCustomHeaderTestComponent);
        customFixture.detectChanges();
        tick();

        const accordion = customFixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
        expect(accordion.effectiveLuxTogglePosition()).toBe('before');
      }));
    });
  });
});

@Component({
  selector: 'lux-test-accordion-aria',
  template: `
    <lux-accordion-aria
      [luxMulti]="multi"
      [luxMode]="mode"
      [luxDisabled]="disabled"
      [luxColor]="color"
      [luxTogglePosition]="togglePosition"
    >
      <lux-panel-aria>
        <lux-panel-aria-header-title luxTagId="test-panel-1"> Test Panel 1 </lux-panel-aria-header-title>
        <lux-panel-aria-content> Content 1 </lux-panel-aria-content>
      </lux-panel-aria>
      <lux-panel-aria>
        <lux-panel-aria-header-title luxTagId="test-panel-2"> Test Panel 2 </lux-panel-aria-header-title>
        <lux-panel-aria-content> Content 2 </lux-panel-aria-content>
      </lux-panel-aria>
    </lux-accordion-aria>
  `,
  standalone: true,
  imports: [LuxAccordionAriaComponent, LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaContentComponent]
})
class LuxAccordionAriaTestComponent {
  multi = false;
  mode: 'default' | 'flat' = 'default';
  disabled = false;
  color: 'primary' | 'accent' | 'warn' | 'neutral' | undefined = 'primary';
  togglePosition: 'before' | 'after' = 'after';
}

@Component({
  selector: 'lux-test-accordion-aria-custom-header',
  standalone: true,
  imports: [
    LuxAccordionAriaComponent,
    LuxPanelAriaComponent,
    LuxPanelAriaHeaderTitleComponent,
    LuxPanelAriaHeaderCustomComponent,
    LuxPanelAriaContentComponent
  ],
  template: `
    <lux-accordion-aria [luxTogglePosition]="'after'">
      <lux-panel-aria>
        <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
        <lux-panel-aria-header-custom>Custom Header</lux-panel-aria-header-custom>
        <lux-panel-aria-content>Content</lux-panel-aria-content>
      </lux-panel-aria>
    </lux-accordion-aria>
  `
})
class LuxAccordionAriaCustomHeaderTestComponent {}
