import { describe, it, beforeEach, expect, vi, type Mock } from 'vitest';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxConditionalAnnouncer } from './lux-conditional-announcer.service';
import { LuxConditionalHostComponent } from './lux-conditional-host.component';
import { LuxConditionalDirective } from './lux-conditional.directive';

@Component({
  imports: [LuxConditionalDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" id="trigger" (click)="show.set(!show())">Umschalten</button>
    <p *luxConditional="show(); announce: label()" id="content">Inhalt</p>
  `
})
class MockComponent {
  readonly show = signal(false);
  readonly label = signal<string | undefined>('Details');
}

@Component({
  imports: [LuxConditionalDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="container" style="width: 320px">
      <div *luxConditional="true" id="content">
        <div style="width: 1000px">Kind mit großer Min-Content-Breite</div>
      </div>
    </div>
  `
})
class WideContentMockComponent {}

describe('LuxConditionalDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mock: MockComponent;
  let announcer: { announceAdded: Mock; announceRemoved: Mock };

  const panels = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('.lux-conditional__panel'));
  const content = (): HTMLElement | null => fixture.nativeElement.querySelector('#content');

  const createFixture = async (initiallyShown: boolean, options: { label?: string } = { label: 'Details' }): Promise<void> => {
    fixture = TestBed.createComponent(MockComponent);
    mock = fixture.componentInstance;
    mock.show.set(initiallyShown);
    mock.label.set(options.label);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const toggle = async (show: boolean): Promise<void> => {
    mock.show.set(show);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const configure = (animationsEnabled: boolean): void => {
    announcer = { announceAdded: vi.fn(), announceRemoved: vi.fn() };
    TestBed.configureTestingModule({
      imports: [MockComponent],
      providers: [{ provide: LuxConditionalAnnouncer, useValue: announcer }],
      animationsEnabled
    });
  };

  describe('ohne Animationen', () => {
    beforeEach(() => configure(false));

    it('Sollte nichts rendern, solange die Bedingung false ist', async () => {
      await createFixture(false);

      expect(panels().length).toBe(0);
      expect(content()).toBeNull();
    });

    it('Sollte das Template im Panel rendern, wenn die Bedingung true ist', async () => {
      await createFixture(true);

      expect(panels().length).toBe(1);
      expect(panels()[0].querySelector('.lux-conditional__content #content')).not.toBeNull();
    });

    it('Sollte den initialen Zustand nicht ansagen', async () => {
      await createFixture(true);

      expect(announcer.announceAdded).not.toHaveBeenCalled();
      expect(announcer.announceRemoved).not.toHaveBeenCalled();
    });

    it('Sollte Erscheinen und Verschwinden mit dem Label ansagen', async () => {
      await createFixture(false);

      await toggle(true);
      expect(announcer.announceAdded).toHaveBeenCalledExactlyOnceWith('Details');

      await toggle(false);
      expect(announcer.announceRemoved).toHaveBeenCalledExactlyOnceWith('Details');
    });

    it('Sollte ohne Label nie ansagen', async () => {
      await createFixture(false, {});

      await toggle(true);
      await toggle(false);

      expect(announcer.announceAdded).not.toHaveBeenCalled();
      expect(announcer.announceRemoved).not.toHaveBeenCalled();
    });

    it('Sollte den Inhalt nach dem Ausblenden aus dem DOM entfernen', async () => {
      await createFixture(true);

      await toggle(false);

      expect(panels().length).toBe(0);
      expect(content()).toBeNull();
    });

    it('Sollte den Fokus beim Einblenden auf dem Auslöser lassen', async () => {
      await createFixture(false);
      const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
      trigger.focus();

      trigger.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(content()).not.toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('mit Animationen', () => {
    // Länger als die Leave-Animation (160 ms), damit Angular das Element nach animationend entfernt hat.
    const waitForLeave = async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      fixture.detectChanges();
      await fixture.whenStable();
    };

    // jsdom hat kein Element.getAnimations(), dadurch sind animate.enter/animate.leave hier wirkungslos und die
    // Animationsklassen erscheinen nie im DOM. Prüfbar ist nur, wann die Direktive die Enter-Animation aktiviert.
    const animateEnter = (): boolean =>
      fixture.debugElement.query(By.directive(LuxConditionalHostComponent)).componentInstance.animateEnter();

    beforeEach(() => configure(true));

    it('Sollte einen initial sichtbaren Bereich nicht animieren', async () => {
      await createFixture(true);

      expect(animateEnter()).toBe(false);
    });

    it('Sollte die Enter-Animation beim Einblenden aktivieren', async () => {
      await createFixture(false);
      expect(animateEnter()).toBe(false);

      await toggle(true);

      expect(animateEnter()).toBe(true);
    });

    it('Sollte den Inhalt nach dem Ausblenden entfernen', async () => {
      await createFixture(true);

      await toggle(false);
      await waitForLeave();

      expect(panels().length).toBe(0);
      expect(content()).toBeNull();
    });

    it('Sollte nach schnellem Aus- und Einblenden genau ein Panel behalten', async () => {
      await createFixture(true);

      await toggle(false);
      await toggle(true);
      await waitForLeave();

      expect(panels().length).toBe(1);
      expect(fixture.nativeElement.querySelectorAll('#content').length).toBe(1);
    });
  });

  describe('Layout', () => {
    beforeEach(() => configure(false));

    // jsdom hat keine Layout-Engine (getBoundingClientRect() liefert immer 0), die tatsächliche Breite prüft
    // deshalb die VRT. Hier wird die Regel abgesichert, die das Wachsen über den Container verhindert: Ohne
    // Minimum von 0 nähme die implizite auto-Spalte die Min-Content-Breite des Inhalts an.
    it('Sollte den Inhalt auf die Breite des Containers begrenzen, auch bei großer Min-Content-Breite', async () => {
      const layoutFixture = TestBed.createComponent(WideContentMockComponent);
      layoutFixture.detectChanges();
      await layoutFixture.whenStable();
      const panel = layoutFixture.nativeElement.querySelector('.lux-conditional__panel') as HTMLElement;

      expect(getComputedStyle(panel).gridTemplateColumns).toBe('minmax(0, 1fr)');
    });
  });
});
