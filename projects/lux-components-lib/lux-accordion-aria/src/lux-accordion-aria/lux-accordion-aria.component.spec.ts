import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
// noinspection DuplicatedCode

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LuxA11yTestHelper } from '../../../test-utils/src/test-utils/lux-a11y-test-helper';
import { LuxTestHelper } from '../../../test-utils/src/test-utils/lux-test-helper';
import { LuxPanelAriaContentComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-content.component';
import { LuxPanelAriaHeaderCustomComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-custom.component';
import { LuxPanelAriaHeaderTitleComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-title.component';
import { LuxPanelAriaComponent } from '../lux-panel-aria/lux-panel-aria.component';
import { LuxAccordionAriaComponent } from './lux-accordion-aria.component';

describe('LuxAccordionAriaComponent', () => {
  describe('Basis-Funktionalität', () => {
    let fixture: ComponentFixture<LuxAccordionAriaTestComponent>;
    let testComponent: LuxAccordionAriaTestComponent;

    beforeEach(async () => {
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
    });

    it('sollte erstellt werden', () => {
      expect(testComponent).toBeTruthy();
    });

    it('sollte luxTogglePosition auf alle Panels ohne Custom Header anwenden', async () => {
      const headerButtons = fixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle'));

      expect(headerButtons.length).toBe(2);
      headerButtons.forEach((headerButton) => {
        expect(headerButton.nativeElement.classList.contains('lux-expansion-toggle-indicator-before')).toBe(false);
        expect(headerButton.query(By.css('.lux-expansion-indicator-after'))).toBeTruthy();
      });

      testComponent.togglePosition.set('before');
      await LuxTestHelper.wait(fixture);

      fixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle')).forEach((headerButton) => {
        expect(headerButton.nativeElement.classList.contains('lux-expansion-toggle-indicator-before')).toBe(true);
        expect(headerButton.query(By.css('.lux-expansion-indicator-before'))).toBeTruthy();
        expect(headerButton.query(By.css('.lux-expansion-indicator-after'))).toBeFalsy();
      });
    });

    it('sollte die luxMulti-Eigenschaft respektieren', async () => {
      testComponent.multi.set(false);
      await LuxTestHelper.wait(fixture);

      const accordionComponent = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
      expect(accordionComponent.luxMulti()).toBe(false);

      testComponent.multi.set(true);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);
      fixture.detectChanges();

      expect(accordionComponent.luxMulti()).toBe(true);
    });

    it('sollte bei luxMulti=false nur ein Panel gleichzeitig geöffnet lassen', async () => {
      const headerButtons = fixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle'));

      headerButtons[0].nativeElement.click();
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      headerButtons[1].nativeElement.click();
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);
      fixture.detectChanges();

      expect(headerButtons[0].nativeElement.getAttribute('aria-expanded')).toBe('false');
      expect(headerButtons[1].nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('sollte verschachtelte Accordions unabhängig voneinander verwalten', async () => {
      const nestedFixture = TestBed.createComponent(LuxNestedAccordionAriaTestComponent);
      nestedFixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const headerButtons = nestedFixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle'));
      headerButtons[0].nativeElement.click();
      nestedFixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const innerHeaderButtons = nestedFixture.debugElement.queryAll(By.css('.lux-expansion-panel-header-toggle'));
      innerHeaderButtons[1].nativeElement.click();
      nestedFixture.detectChanges();
      await LuxTestHelper.wait(fixture);
      innerHeaderButtons[2].nativeElement.click();
      nestedFixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      expect(innerHeaderButtons[0].nativeElement.getAttribute('aria-expanded')).toBe('true');
      expect(innerHeaderButtons[1].nativeElement.getAttribute('aria-expanded')).toBe('false');
      expect(innerHeaderButtons[2].nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('sollte die luxDisabled-Eigenschaft respektieren', async () => {
      const accordionComponent = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
      expect(accordionComponent.luxDisabled()).toBeFalsy();

      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      expect(accordionComponent.luxDisabled()).toBe(true);
    });

    it('sollte Farben-CSS-Klassen anwenden', async () => {
      const accordion = fixture.debugElement.query(By.css('lux-accordion-aria > div'));

      testComponent.color.set('primary');
      await LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-primary')).toBe(true);

      testComponent.color.set('accent');
      await LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-accent')).toBe(true);

      testComponent.color.set('warn');
      await LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-warn')).toBe(true);

      testComponent.color.set('neutral');
      await LuxTestHelper.wait(fixture);
      expect(accordion.nativeElement.classList.contains('lux-neutral')).toBe(true);
    });

    it('sollte den Abstand im flat-Modus deaktivieren', async () => {
      const accordion = fixture.debugElement.query(By.directive(LuxAccordionAriaComponent));

      expect(accordion.nativeElement.classList.contains('lux-default')).toBe(true);
      expect(accordion.nativeElement.classList.contains('lux-flat')).toBe(false);

      testComponent.mode.set('flat');
      await LuxTestHelper.wait(fixture);

      expect(accordion.nativeElement.classList.contains('lux-default')).toBe(false);
      expect(accordion.nativeElement.classList.contains('lux-flat')).toBe(true);
    });

    describe('Custom Header', () => {
      it('sollte bei einem Custom Header die Toggle-Position auf before setzen', async () => {
        const customFixture = TestBed.createComponent(LuxAccordionAriaCustomHeaderTestComponent);
        customFixture.detectChanges();
        await LuxTestHelper.wait(fixture);

        const accordion = customFixture.debugElement.query(By.directive(LuxAccordionAriaComponent)).componentInstance;
        expect(accordion.effectiveLuxTogglePosition()).toBe('before');
      });
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxAccordionAriaTestComponent>;
    let testComponent: LuxAccordionAriaTestComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [
          LuxAccordionAriaComponent,
          LuxPanelAriaComponent,
          LuxPanelAriaHeaderTitleComponent,
          LuxPanelAriaContentComponent,
          LuxAccordionAriaTestComponent
        ]
      });
      fixture = TestBed.createComponent(LuxAccordionAriaTestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    });

    it('Accordion (kollabiert) hat keine Barrierefreiheitsverletzungen', async () => {
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Accordion (expandiert) hat keine Barrierefreiheitsverletzungen', async () => {
      const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
      headerButton.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Accordion (disabled) hat keine Barrierefreiheitsverletzungen', async () => {
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  selector: 'lux-test-accordion-aria',
  template: `
    <lux-accordion-aria
      [luxMulti]="multi()"
      [luxMode]="mode()"
      [luxDisabled]="disabled()"
      [luxColor]="color()"
      [luxTogglePosition]="togglePosition()"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAccordionAriaComponent, LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaContentComponent]
})
class LuxAccordionAriaTestComponent {
  multi = signal(false);
  mode = signal<'default' | 'flat'>('default');
  disabled = signal(false);
  color = signal<'primary' | 'accent' | 'warn' | 'neutral' | undefined>('primary');
  togglePosition = signal<'before' | 'after'>('after');
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

@Component({
  selector: 'lux-nested-accordion-aria-test',
  standalone: true,
  imports: [LuxAccordionAriaComponent, LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-accordion-aria>
      <lux-panel-aria>
        <lux-panel-aria-header-title>Outer</lux-panel-aria-header-title>
        <lux-panel-aria-content>
          <lux-accordion-aria>
            <lux-panel-aria>
              <lux-panel-aria-header-title>Inner 1</lux-panel-aria-header-title>
              <lux-panel-aria-content>Inner Content 1</lux-panel-aria-content>
            </lux-panel-aria>
            <lux-panel-aria>
              <lux-panel-aria-header-title>Inner 2</lux-panel-aria-header-title>
              <lux-panel-aria-content>Inner Content 2</lux-panel-aria-content>
            </lux-panel-aria>
          </lux-accordion-aria>
        </lux-panel-aria-content>
      </lux-panel-aria>
    </lux-accordion-aria>
  `
})
class LuxNestedAccordionAriaTestComponent {}
