// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaHiddenDirective } from './lux-aria-hidden.directive';

describe('LuxAriaHiddenDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LuxComponentsConfigService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  describe('mit Selector', () => {
    let fixture: ComponentFixture<LuxWithSelectorComponent>;
    let component: LuxWithSelectorComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(LuxWithSelectorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('Sollte aria-hidden in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-hidden')).toBeNull();

      // Aria-Hidden setzen
      let ariaHidden: boolean | undefined = true;
      component.ariaHidden.set(ariaHidden);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-hidden')).toEqual('true');

      // Aria-Hidden aktualisieren
      ariaHidden = false;
      component.ariaHidden.set(ariaHidden);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-hidden')).toEqual('false');

      // Aria-Hidden entfernen
      ariaHidden = undefined;
      component.ariaHidden.set(ariaHidden);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('ohne Selector', () => {
    let fixture: ComponentFixture<LuxWithoutSelectorComponent>;
    let component: LuxWithoutSelectorComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(LuxWithoutSelectorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('Sollte aria-hidden in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-hidden')).toBeNull();

      // Aria-Hidden setzen
      let ariaHidden: boolean | undefined = true;
      component.ariaHidden.set(ariaHidden);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-hidden')).toEqual('true');

      // Aria-Hidden aktualisieren
      ariaHidden = false;
      component.ariaHidden.set(ariaHidden);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-hidden')).toEqual('false');

      // Aria-Hidden entfernen
      ariaHidden = undefined;
      component.ariaHidden.set(ariaHidden);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-hidden')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaHidden]="ariaHidden()" luxAriaHiddenSelector="button"></lux-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAriaHiddenDirective]
})
class LuxWithSelectorComponent {
  readonly ariaHidden = signal<boolean | undefined>(undefined);
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaHidden]="ariaHidden()"></lux-button> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAriaHiddenDirective]
})
class LuxWithoutSelectorComponent {
  readonly ariaHidden = signal<boolean | undefined>(undefined);
}
