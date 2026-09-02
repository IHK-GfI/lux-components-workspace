// noinspection DuplicatedCode

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxAccordionAriaComponent } from './lux-accordion-aria.component';
import { LuxPanelAriaComponent } from '../lux-panel-aria/lux-panel-aria.component';
import { LuxPanelAriaContentComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-content.component';
import { LuxPanelAriaHeaderTitleComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-title.component';

describe('LuxAccordionAriaComponent', () => {
  describe('Basis-Funktionalität', () => {
    let fixture: ComponentFixture<LuxAccordionAriaTestComponent>;
    let testComponent: LuxAccordionAriaTestComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [LuxAccordionAriaComponent, LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaContentComponent]
      });
      fixture = TestBed.createComponent(LuxAccordionAriaTestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      tick();
    }));

    it('sollte erstellt werden', () => {
      expect(testComponent).toBeTruthy();
    });

    it('sollte CDK-Accordion verwenden', () => {
      const cdkAccordion = fixture.debugElement.query(By.css('cdk-accordion'));
      expect(cdkAccordion).toBeTruthy();
    });

    it('sollte die luxMulti-Eigenschaft respektieren', fakeAsync(() => {
      testComponent.multi = false;
      LuxTestHelper.wait(fixture);

      const cdkAccordionComponent = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
      expect(cdkAccordionComponent.luxMulti()).toBe(false);

      testComponent.multi = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(cdkAccordionComponent.luxMulti()).toBe(true);
    }));

    it('sollte die luxDisabled-Eigenschaft respektieren', fakeAsync(() => {
      const cdkAccordionComponent = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
      expect(cdkAccordionComponent.luxDisabled()).toBeFalsy();

      testComponent.disabled = true;
      LuxTestHelper.wait(fixture);

      expect(cdkAccordionComponent.luxDisabled()).toBe(true);
    }));

    it('sollte Farben-CSS-Klassen anwenden', fakeAsync(() => {
      const accordion = fixture.debugElement.query(By.css('cdk-accordion'));

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
  });
});

@Component({
  selector: 'lux-test-accordion-aria',
  template: `
    <lux-accordion-aria [luxMulti]="multi" [luxDisabled]="disabled" [luxColor]="color">
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
  disabled = false;
  color: 'primary' | 'accent' | 'warn' | 'neutral' | undefined = 'primary';
}
