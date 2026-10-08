import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxA11yTestHelper } from '../../../test-utils/src/test-utils/lux-a11y-test-helper';
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
      expect(component.luxAnimated()).toBeTrue();

      expect(items().length).toBe(1);
      expect(items()[0].classList.contains('lux-skeleton__item--text')).toBeTrue();
      expect(items()[0].classList.contains('lux-skeleton__item--trailing')).toBeFalse();
    });

    it('sollte den Host vor assistiven Technologien verbergen', () => {
      expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    });

    it('sollte die Varianten-Klasse für rect und circle setzen', () => {
      fixture.componentRef.setInput('luxVariant', 'rect');
      fixture.detectChanges();
      expect(items()[0].classList.contains('lux-skeleton__item--rect')).toBeTrue();
      expect(items()[0].classList.contains('lux-rounded-sm')).toBeTrue();

      fixture.componentRef.setInput('luxVariant', 'circle');
      fixture.detectChanges();
      expect(items()[0].classList.contains('lux-skeleton__item--circle')).toBeTrue();
      expect(items()[0].classList.contains('lux-rounded-full')).toBeTrue();
    });

    it('sollte luxCount Platzhalter mit einer kürzeren letzten Textzeile darstellen', () => {
      fixture.componentRef.setInput('luxCount', 3);
      fixture.detectChanges();

      expect(items().length).toBe(3);
      expect(items()[0].classList.contains('lux-skeleton__item--trailing')).toBeFalse();
      expect(items()[0].classList.contains('lux-mb-3')).toBeTrue();
      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBeTrue();
      expect(items()[2].classList.contains('lux-mb-3')).toBeFalse();
    });

    it('sollte die letzte Textzeile relativ zu luxWidth kürzen', () => {
      (fixture.nativeElement as HTMLElement).style.width = '500px';
      fixture.componentRef.setInput('luxCount', 3);
      fixture.detectChanges();
      // Ohne Theme fehlt die Utility-Klasse lux-block, ohne die width an den Spans nicht greift.
      const width = (index: number) => {
        items().forEach((item) => (item.style.display = 'block'));
        return items()[index].getBoundingClientRect().width;
      };

      expect(width(0)).toBeCloseTo(500, 0);
      expect(width(2)).toBeCloseTo(300, 0);

      fixture.componentRef.setInput('luxWidth', '40%');
      fixture.detectChanges();

      expect(width(0)).toBeCloseTo(200, 0);
      expect(width(2)).toBeCloseTo(120, 0);

      fixture.componentRef.setInput('luxWidth', '100px');
      fixture.detectChanges();

      expect(width(0)).toBeCloseTo(100, 0);
      expect(width(2)).toBeCloseTo(60, 0);
    });

    it('sollte Kreise mit gleicher Breite und Höhe darstellen, auch bei Prozentangaben', () => {
      (fixture.nativeElement as HTMLElement).style.width = '500px';
      fixture.componentRef.setInput('luxVariant', 'circle');
      fixture.componentRef.setInput('luxHeight', '10px');
      fixture.detectChanges();
      // Ohne Theme fehlt die Utility-Klasse lux-block, ohne die width und aspect-ratio an den Spans nicht greifen.
      const size = () => {
        items()[0].style.display = 'block';
        const rect = items()[0].getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      };

      fixture.componentRef.setInput('luxWidth', '20%');
      fixture.detectChanges();
      expect(size().width).toBeCloseTo(100, 0);
      expect(size().height).toBeCloseTo(100, 0);

      fixture.componentRef.setInput('luxWidth', '48px');
      fixture.detectChanges();
      expect(size().width).toBeCloseTo(48, 0);
      expect(size().height).toBeCloseTo(48, 0);
    });

    it('sollte die letzte Zeile bei rect-Platzhaltern nicht kürzen', () => {
      fixture.componentRef.setInput('luxVariant', 'rect');
      fixture.componentRef.setInput('luxCount', 3);
      fixture.detectChanges();

      expect(items()[2].classList.contains('lux-skeleton__item--trailing')).toBeFalse();
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

      expect((fixture.nativeElement as HTMLElement).classList.contains('lux-skeleton--static')).toBeTrue();
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
