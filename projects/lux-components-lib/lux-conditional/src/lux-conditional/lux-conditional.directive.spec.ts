import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxConditionalAnnouncer } from './lux-conditional-announcer.service';
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

describe('LuxConditionalDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mock: MockComponent;
  let announcer: jasmine.SpyObj<LuxConditionalAnnouncer>;

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
    announcer = jasmine.createSpyObj<LuxConditionalAnnouncer>('LuxConditionalAnnouncer', ['announceAdded', 'announceRemoved']);
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
      expect(announcer.announceAdded).toHaveBeenCalledOnceWith('Details');

      await toggle(false);
      expect(announcer.announceRemoved).toHaveBeenCalledOnceWith('Details');
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

    beforeEach(() => configure(true));

    it('Sollte einen initial sichtbaren Bereich nicht animieren', async () => {
      await createFixture(true);

      expect(panels()[0].classList).not.toContain('lux-conditional__panel--enter');
    });

    it('Sollte beim Einblenden die Enter-Klasse setzen', async () => {
      await createFixture(false);

      await toggle(true);

      expect(panels()[0].classList).toContain('lux-conditional__panel--enter');
    });

    it('Sollte den Inhalt erst nach der Leave-Animation entfernen', async () => {
      await createFixture(true);

      await toggle(false);
      expect(panels()[0]?.classList).toContain('lux-conditional__panel--leave');

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
});
