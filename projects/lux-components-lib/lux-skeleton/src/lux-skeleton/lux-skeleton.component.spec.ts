import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxSkeletonComponent, LuxSkeletonVariant } from './lux-skeleton.component';

describe('LuxSkeletonComponent', () => {
  describe('Basis-Funktionalität', () => {
    let fixture: ComponentFixture<LuxSkeletonComponent>;
    let component: LuxSkeletonComponent;

    const items = (): NodeListOf<HTMLElement> => fixture.nativeElement.querySelectorAll('.lux-skeleton__item');

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [LuxSkeletonComponent] }).compileComponents();
      fixture = TestBed.createComponent(LuxSkeletonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte standardmäßig einen animierten Text-Platzhalter darstellen', () => {
      expect(component.luxVariant()).toBe('text');
      expect(component.luxCount()).toBe(1);
      expect(component.luxAnimated()).toBe(true);

      expect(items().length).toBe(1);
      expect(items()[0].classList.contains('lux-skeleton__item--text')).toBe(true);
      expect(items()[0].classList.contains('lux-skeleton__item--trailing')).toBe(false);
    });

    it('sollte den Host vor assistiven Technologien verbergen', () => {
      expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    });

    it('sollte die Varianten-Klasse für rect und circle setzen', () => {
      fixture.componentRef.setInput('luxVariant', 'rect');
      fixture.detectChanges();
      expect(items()[0].classList.contains('lux-skeleton__item--rect')).toBe(true);
      expect(items()[0].classList.contains('lux-rounded-sm')).toBe(true);

      fixture.componentRef.setInput('luxVariant', 'circle');
      fixture.detectChanges();
      expect(items()[0].classList.contains('lux-skeleton__item--circle')).toBe(true);
      expect(items()[0].classList.contains('lux-rounded-full')).toBe(true);
    });

    it('sollte luxCount Platzhalter mit einer kürzeren letzten Textzeile darstellen', () => {
      fixture.componentRef.setInput('luxCount', 3);
      fixture.detectChanges();

      expect(items().length).toBe(3);
      expect(items()[0].classList.contains('lux-skeleton__item--trailing')).toBe(false);
      expect(items()[0].classList.contains('lux-mb-3')).toBe(true);
      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBe(true);
      expect(items()[2].classList.contains('lux-mb-3')).toBe(false);
    });

    it('sollte die letzte Textzeile relativ zu luxWidth kürzen', () => {
      // jsdom hat keine Layout-Engine (getBoundingClientRect() liefert immer 0), die tatsächlichen Breiten
      // lassen sich hier daher nicht messen. Die Kürzung auf 60 % von luxWidth erfolgt per CSS über die
      // Klasse lux-skeleton__item--trailing und die Custom Property --lux-skeleton-width (siehe SCSS).
      const host = fixture.nativeElement as HTMLElement;
      fixture.componentRef.setInput('luxCount', 3);
      fixture.detectChanges();

      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBe(true);
      expect(host.style.getPropertyValue('--lux-skeleton-width')).toBe('');

      fixture.componentRef.setInput('luxWidth', '40%');
      fixture.detectChanges();

      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBe(true);
      expect(host.style.getPropertyValue('--lux-skeleton-width')).toBe('40%');

      fixture.componentRef.setInput('luxWidth', '100px');
      fixture.detectChanges();

      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBe(true);
      expect(host.style.getPropertyValue('--lux-skeleton-width')).toBe('100px');
    });

    it('sollte Kreise über luxWidth dimensionieren, auch bei Prozentangaben', () => {
      // jsdom hat keine Layout-Engine (getBoundingClientRect() liefert immer 0), Breite und Höhe lassen sich
      // hier daher nicht messen. Kreise erhalten ihre Höhe per CSS über aspect-ratio aus --lux-skeleton-width,
      // luxHeight wird dafür nicht verwendet (siehe SCSS).
      const host = fixture.nativeElement as HTMLElement;
      fixture.componentRef.setInput('luxVariant', 'circle');
      fixture.componentRef.setInput('luxHeight', '10px');
      fixture.componentRef.setInput('luxWidth', '20%');
      fixture.detectChanges();

      expect(items()[0].classList.contains('lux-skeleton__item--circle')).toBe(true);
      expect(items()[0].classList.contains('lux-rounded-full')).toBe(true);
      expect(host.style.getPropertyValue('--lux-skeleton-width')).toBe('20%');

      fixture.componentRef.setInput('luxWidth', '48px');
      fixture.detectChanges();
      expect(host.style.getPropertyValue('--lux-skeleton-width')).toBe('48px');
    });

    it('sollte die letzte Zeile bei rect-Platzhaltern nicht kürzen', () => {
      fixture.componentRef.setInput('luxVariant', 'rect');
      fixture.componentRef.setInput('luxCount', 3);
      fixture.detectChanges();

      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBe(false);
    });

    it('sollte luxWidth und luxHeight als Custom Properties am Host setzen', () => {
      fixture.componentRef.setInput('luxWidth', '120px');
      fixture.componentRef.setInput('luxHeight', '2em');
      fixture.detectChanges();

      const host = fixture.nativeElement as HTMLElement;
      expect(host.style.getPropertyValue('--lux-skeleton-width')).toBe('120px');
      expect(host.style.getPropertyValue('--lux-skeleton-height')).toBe('2em');
    });

    it('sollte den Host als statisch markieren, wenn die Animation abgeschaltet ist', () => {
      fixture.componentRef.setInput('luxAnimated', false);
      fixture.detectChanges();

      expect((fixture.nativeElement as HTMLElement).classList.contains('lux-skeleton--static')).toBe(true);
    });

    it('sollte bei ungültigen luxCount-Werten mindestens einen Platzhalter darstellen', () => {
      fixture.componentRef.setInput('luxCount', 0);
      fixture.detectChanges();

      expect(items().length).toBe(1);
    });
  });

  describe('Im Template', () => {
    let fixture: ComponentFixture<LuxSkeletonTestComponent>;
    let testComponent: LuxSkeletonTestComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [LuxSkeletonTestComponent] }).compileComponents();
      fixture = TestBed.createComponent(LuxSkeletonTestComponent);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sollte Änderungen der gebundenen Signale übernehmen', () => {
      const skeleton = (fixture.nativeElement as HTMLElement).querySelector('lux-skeleton.configurable') as HTMLElement;
      expect(skeleton.querySelectorAll('.lux-skeleton__item--text').length).toBe(1);

      testComponent.variant.set('rect');
      testComponent.count.set(2);
      testComponent.width.set('50%');
      fixture.detectChanges();

      expect(skeleton.querySelectorAll('.lux-skeleton__item--rect').length).toBe(2);
      expect(skeleton.style.getPropertyValue('--lux-skeleton-width')).toBe('50%');
    });

    it('sollte die Custom Properties wieder entfernen, wenn luxWidth und luxHeight zurückgesetzt werden', () => {
      const skeleton = (fixture.nativeElement as HTMLElement).querySelector('lux-skeleton.configurable') as HTMLElement;

      testComponent.width.set('50%');
      testComponent.height.set('3em');
      fixture.detectChanges();
      expect(skeleton.style.getPropertyValue('--lux-skeleton-width')).toBe('50%');

      testComponent.width.set(undefined);
      testComponent.height.set(undefined);
      fixture.detectChanges();
      expect(skeleton.style.getPropertyValue('--lux-skeleton-width')).toBe('');
      expect(skeleton.style.getPropertyValue('--lux-skeleton-height')).toBe('');
    });

    it('sollte keine A11y-Verletzungen aufweisen (Listenzeile mit aria-busy)', async () => {
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine A11y-Verletzungen für alle Varianten aufweisen', async () => {
      for (const variant of ['text', 'rect', 'circle'] as LuxSkeletonVariant[]) {
        testComponent.variant.set(variant);
        testComponent.count.set(3);
        fixture.detectChanges();

        await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
      }
    });
  });
});

@Component({
  selector: 'lux-skeleton-test',
  template: `
    <lux-skeleton
      class="configurable"
      [luxVariant]="variant()"
      [luxCount]="count()"
      [luxWidth]="width()"
      [luxHeight]="height()"
    ></lux-skeleton>
    <ul aria-busy="true" aria-label="Liste wird geladen">
      @for (row of [1, 2]; track row) {
        <li>
          <lux-skeleton luxVariant="circle" luxWidth="2.5em"></lux-skeleton>
          <lux-skeleton luxWidth="40%"></lux-skeleton>
          <lux-skeleton></lux-skeleton>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSkeletonComponent]
})
class LuxSkeletonTestComponent {
  readonly variant = signal<LuxSkeletonVariant>('text');
  readonly count = signal(1);
  readonly width = signal<string | undefined>(undefined);
  readonly height = signal<string | undefined>(undefined);
}
