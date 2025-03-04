// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaRequiredDirective } from './lux-aria-required.directive';

describe('LuxAriaRequiredDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LuxComponentsConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

    it('Sollte aria-required in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-required')).toBeNull();

      // aria-required setzen
      let ariaRequired: boolean | undefined = true;
      component.ariaRequired = ariaRequired;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-required')).toEqual('true');

      // aria-required aktualisieren
      ariaRequired = false;
      component.ariaRequired = ariaRequired;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-required')).toEqual('false');

      // aria-required entfernen
      ariaRequired = undefined;
      component.ariaRequired = ariaRequired;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-required')).toBeNull();
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

    it('Sollte aria-required in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-required')).toBeNull();

      // aria-required setzen
      let ariaRequired: boolean | undefined = true;
      component.ariaRequired = ariaRequired;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-required')).toEqual('true');

      // aria-required aktualisieren
      ariaRequired = false;
      component.ariaRequired = ariaRequired;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-required')).toEqual('false');

      // aria-required entfernen
      ariaRequired = undefined;
      component.ariaRequired = ariaRequired;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-required')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button
      luxIconName="lux-interface-alert-alarm-bell-2"
      [luxAriaRequired]="ariaRequired"
      luxAriaRequiredSelector="button"
    ></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaRequiredDirective]
})
class LuxWithSelectorComponent {
  ariaRequired?: boolean;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaRequired]="ariaRequired"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaRequiredDirective]
})
class LuxWithoutSelectorComponent {
  ariaRequired?: boolean;
}
