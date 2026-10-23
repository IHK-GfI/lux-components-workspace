// noinspection DuplicatedCode

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxProgressColor } from '../../lux-util/lux-colors.enum';
import { LuxProgressComponent, LuxProgressModeType, LuxProgressSizeType, LuxProgressType } from './lux-progress.component';

describe('LuxProgressComponent', () => {
  let component: LuxMockProgressBarComponent;
  let fixture: ComponentFixture<LuxMockProgressBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxMockProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(() => {
    LuxA11yTestHelper.addA11yMatchers();
  });

  describe('Als ProgressBar', () => {
    it('Sollte eine ProgressBar erzeugen', () => {
      // Vorbedingungen testen
      // Standardmäßig immer ProgressBar
      const progressbar = fixture.debugElement.query(By.css('mat-progress-bar'));
      expect(progressbar).not.toBeNull();
      // Änderungen durchführen
      // n.A.
      // Nachbedingungen prüfen
      // n.A.
    });

    it('zeigt den Text nur bei gesetztem luxShowText, luxText und im determinate-Modus', () => {
      component.mode = 'determinate';
      component.showText = true;
      fixture.detectChanges();

      // Ohne luxText wird der Prozentwert angezeigt (für Screenreader ausgeblendet, aria-valuenow reicht).
      component.value = 70.4;
      fixture.detectChanges();
      const percentText: HTMLElement = fixture.nativeElement.querySelector('.lux-progress-text');
      expect(percentText.textContent!.trim()).toBe('70%');
      expect(percentText.getAttribute('aria-hidden')).toBe('true');
      expect(fixture.nativeElement.querySelector('mat-progress-bar').getAttribute('aria-describedby')).toBeNull();

      component.text = '5 von 10 erledigt';
      component.textPosition = 'left';
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.lux-progress-text').textContent.trim()).toBe('5 von 10 erledigt');
      expect(fixture.nativeElement.querySelector('.lux-progress-content').classList).toContain('lux-progress-text-position-left');

      component.mode = 'indeterminate';
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.lux-progress-text')).toBeNull();
    });

    it('setzt luxMuted auf die Progressbar und zeigt eine Live-Ansage bei indeterminate', () => {
      expect(fixture.nativeElement.querySelector('mat-progress-bar').classList).not.toContain('lux-progress-muted');
      component.muted = true;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('mat-progress-bar').classList).toContain('lux-progress-muted');
      expect(fixture.nativeElement.querySelector('[role="status"][aria-live="polite"]')).not.toBeNull();
    });

    it('verknüpft den sichtbaren Text per aria-describedby mit der Progressbar', () => {
      const progressbar: HTMLElement = fixture.nativeElement.querySelector('mat-progress-bar');
      expect(progressbar.getAttribute('aria-describedby')).toBeNull();

      component.mode = 'determinate';
      component.showText = true;
      component.text = '5 von 10 erledigt';
      fixture.detectChanges();

      const text: HTMLElement = fixture.nativeElement.querySelector('.lux-progress-text');
      expect(text.id).toBeTruthy();
      expect(progressbar.getAttribute('aria-describedby')).toBe(text.id);
    });

    it('Sollte die CSS-Klassen für Farben eintragen', () => {
      // Vorbedingungen testen
      const blue = fixture.debugElement.query(By.css('.lux-bg-color-blue'));
      expect(blue).toBeDefined();
      // Änderungen durchführen
      component.color = 'red';
      fixture.detectChanges();
      // Nachbedingungen prüfen
      const red = fixture.debugElement.query(By.css('.lux-bg-color-red'));
      expect(red).toBeDefined();
      // Änderungen durchführen
      component.color = 'purple';
      fixture.detectChanges();
      // Nachbedingungen prüfen
      const purple = fixture.debugElement.query(By.css('.lux-bg-color-purple'));
      expect(purple).toBeDefined();
    });

    it('Sollte den Wert ändern (mode = determinate)', fakeAsync(() => {
      // Vorbedingungen testen
      component.mode = 'determinate';
      const matProgress: MatProgressBar = fixture.debugElement.query(By.directive(MatProgressBar)).componentInstance;
      LuxTestHelper.wait(fixture);
      expect(matProgress.value).toBe(0);
      // Änderungen durchführen
      component.value = 10;
      LuxTestHelper.wait(fixture);
      // Nachbedingungen prüfen
      expect(matProgress.value).toBe(10);
    }));
  });

  describe('Als Spinner', () => {
    it('Sollte einen Spinner erzeugen', () => {
      // Vorbedingungen testen
      // Standardmäßig immer ProgressBar
      let progressbar = fixture.debugElement.query(By.css('mat-progress-bar'));
      let spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
      expect(progressbar).not.toBeNull();
      expect(spinner).toBeNull();
      // Änderungen durchführen
      component.type = 'Spinner';
      fixture.detectChanges();
      // Nachbedingungen prüfen
      progressbar = fixture.debugElement.query(By.css('mat-progress-bar'));
      spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
      expect(progressbar).toBeNull();
      expect(spinner).toBeDefined();
    });

    it('Sollte die CSS-Klassen für Farben eintragen', fakeAsync(() => {
      // Vorbedingungen testen
      component.type = 'Spinner';
      fixture.detectChanges();
      const blue = fixture.debugElement.query(By.css('.lux-bg-color-blue'));
      expect(blue).toBeDefined();
      // Änderungen durchführen
      component.color = 'red';
      fixture.detectChanges();
      // Nachbedingungen prüfen
      const red = fixture.debugElement.query(By.css('.lux-bg-color-red'));
      expect(red).toBeDefined();
      // Änderungen durchführen
      component.color = 'purple';
      fixture.detectChanges();
      // Nachbedingungen prüfen
      const purple = fixture.debugElement.query(By.css('.lux-bg-color-purple'));
      expect(purple).toBeDefined();
    }));

    it('Sollte den Wert ändern (mode = determinate)', fakeAsync(() => {
      // Vorbedingungen testen
      component.type = 'Spinner';
      fixture.detectChanges();

      const matProgress: MatProgressBar = fixture.debugElement.query(By.directive(MatProgressSpinner)).componentInstance;
      component.mode = 'determinate';
      LuxTestHelper.wait(fixture);
      expect(matProgress.value).toBe(0);
      // Änderungen durchführen
      component.value = 10;
      LuxTestHelper.wait(fixture);
      // Nachbedingungen prüfen
      expect(matProgress.value).toBe(10);
    }));

    it('zeigt den gerundeten Prozentwert nur bei determinate und luxShowText', () => {
      component.type = 'Spinner';
      component.mode = 'determinate';
      component.value = 50.4;
      component.showText = true;
      component.muted = true;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.lux-progress-spinner-text').textContent.trim()).toBe('50%');
      expect(fixture.nativeElement.querySelector('mat-progress-spinner').classList).toContain('lux-progress-muted');

      component.mode = 'indeterminate';
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.lux-progress-spinner-text')).toBeNull();
      expect(fixture.nativeElement.querySelector('[role="status"][aria-live="polite"]')).not.toBeNull();
    });

    it('begrenzt den Prozentwert auf 0 bis 100', () => {
      component.type = 'Spinner';
      component.mode = 'determinate';
      component.showText = true;
      component.value = 150;
      fixture.detectChanges();

      const text = () => fixture.nativeElement.querySelector('.lux-progress-spinner-text').textContent.trim();
      expect(text()).toBe('100%');

      component.value = -5;
      fixture.detectChanges();
      expect(text()).toBe('0%');

      component.value = undefined as unknown as number;
      fixture.detectChanges();
      expect(text()).toBe('0%');
    });

    it('blendet den Prozentwert für Screenreader aus (aria-valuenow reicht)', () => {
      component.type = 'Spinner';
      component.mode = 'determinate';
      component.showText = true;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.lux-progress-spinner-text').getAttribute('aria-hidden')).toBe('true');
    });

    it('setzt Strichstärke und Inset des Track-Rings passend zur Größe', () => {
      component.type = 'Spinner';
      const progress: LuxProgressComponent = fixture.debugElement.query(By.directive(LuxProgressComponent)).componentInstance;

      component.size = 'small';
      fixture.detectChanges();
      const spinnerEl: HTMLElement = fixture.nativeElement.querySelector('mat-progress-spinner');
      expect(spinnerEl.style.getPropertyValue('--lux-progress-spinner-stroke-width')).toBe('2px');
      expect(progress.luxSpinnerTrackInset).toBeCloseTo(0.5, 5);

      component.size = 'medium';
      fixture.detectChanges();
      expect(progress.luxSpinnerTrackInset).toBeCloseTo(0.2907, 3);

      component.size = 'large';
      fixture.detectChanges();
      expect(progress.luxSpinnerTrackInset).toBe(0);
    });

    it('behält die Spinnergrößen und Strichstärken bei', () => {
      component.type = 'Spinner';
      fixture.detectChanges();
      const spinner: MatProgressSpinner = fixture.debugElement.query(By.directive(MatProgressSpinner)).componentInstance;

      component.size = 'small';
      fixture.detectChanges();
      expect(spinner.diameter).toBe(24);
      expect(spinner.strokeWidth).toBe(2);

      component.size = 'medium';
      fixture.detectChanges();
      expect(spinner.diameter).toBe(48);
      expect(spinner.strokeWidth).toBe(5);

      component.size = 'large';
      fixture.detectChanges();
      expect(spinner.diameter).toBe(96);
      expect(spinner.strokeWidth).toBe(10);
    });
  });

  describe('Live-Ansage', () => {
    it('befüllt die Live-Region erst nach dem Rendern und leert sie bei determinate', fakeAsync(() => {
      // Eigene Instanz innerhalb von fakeAsync, damit der Timer der Ansage kontrollierbar ist.
      const announceFixture = TestBed.createComponent(LuxMockProgressBarComponent);
      const region = () => announceFixture.nativeElement.querySelector('[role="status"]').textContent.trim();

      // Region steht zunächst leer im DOM, damit Screenreader die Änderung erkennen.
      announceFixture.detectChanges();
      expect(region()).toBe('');
      tick(100);
      announceFixture.detectChanges();
      expect(region()).not.toBe('');

      announceFixture.componentInstance.mode = 'determinate';
      announceFixture.detectChanges();
      expect(region()).toBe('');
      expect(announceFixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();

      announceFixture.componentInstance.mode = 'indeterminate';
      announceFixture.detectChanges();
      expect(region()).toBe('');
      tick(100);
      announceFixture.detectChanges();
      expect(region()).not.toBe('');
    }));
  });

  describe('Ohne luxColor', () => {
    it('setzt keine lux-color-undefined-Klasse', () => {
      const plainFixture = TestBed.createComponent(LuxMockProgressWithoutColorComponent);
      plainFixture.componentInstance.muted = true;
      plainFixture.detectChanges();

      const progressbar: HTMLElement = plainFixture.nativeElement.querySelector('mat-progress-bar');
      expect(progressbar.className).not.toContain('lux-color-');
      expect(progressbar.classList).toContain('lux-progress-bar');
      expect(progressbar.classList).toContain('lux-progress-muted');

      plainFixture.componentInstance.type = 'Spinner';
      plainFixture.detectChanges();

      const spinner: HTMLElement = plainFixture.nativeElement.querySelector('mat-progress-spinner');
      expect(spinner.className).not.toContain('lux-color-');
      expect(spinner.classList).toContain('lux-progress-spinner');
      expect(spinner.classList).toContain('lux-progress-muted');
    });
  });

  describe('A11y', () => {
    it('hat im determinate-Modus mit Text keine Barrierefreiheitsverletzungen', async () => {
      component.mode = 'determinate';
      component.showText = true;
      component.text = '5 von 10 erledigt';
      fixture.detectChanges();

      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);

      component.mode = 'indeterminate';
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  selector: 'lux-mock-progress-bar',
  template: `<lux-progress
    [luxType]="type"
    [luxMode]="mode"
    [luxColor]="color"
    [luxSize]="size"
    [luxValue]="value"
    [luxMuted]="muted"
    [luxShowText]="showText"
    [luxText]="text"
    [luxTextPosition]="textPosition"
  ></lux-progress>`,
  imports: [LuxProgressComponent]
})
class LuxMockProgressBarComponent {
  type?: LuxProgressType;
  mode?: LuxProgressModeType;
  color?: LuxProgressColor;
  size?: LuxProgressSizeType;
  value = 0;
  muted = false;
  showText = false;
  text?: string;
  textPosition: 'bottom' | 'left' | 'top' = 'bottom';

  constructor() {}
}

@Component({
  selector: 'lux-mock-progress-without-color',
  template: `<lux-progress [luxType]="type" [luxMuted]="muted"></lux-progress>`,
  imports: [LuxProgressComponent]
})
class LuxMockProgressWithoutColorComponent {
  type: LuxProgressType = 'Progressbar';
  muted = false;
}
