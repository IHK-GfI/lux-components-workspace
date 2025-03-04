// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaHaspopupDirective } from './lux-aria-haspopup.directive';

describe('LuxAriaHasPopupDirective', () => {
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

    it('Sollte aria-haspopup in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toBeNull();

      // Aria-HasPopup setzen
      let ariaHasPopup: boolean | undefined = true;
      component.ariaHasPopup = ariaHasPopup;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toEqual('true');

      // Aria-HasPopup aktualisieren
      ariaHasPopup = false;
      component.ariaHasPopup = ariaHasPopup;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toEqual('false');

      // Aria-HasPopup entfernen
      ariaHasPopup = undefined;
      component.ariaHasPopup = ariaHasPopup;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toBeNull();
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

    it('Sollte aria-haspopup in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toBeNull();

      // Aria-HasPopup setzen
      let ariaHasPopup: boolean | undefined = true;
      component.ariaHasPopup = ariaHasPopup;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toEqual('true');

      // Aria-HasPopup aktualisieren
      ariaHasPopup = false;
      component.ariaHasPopup = ariaHasPopup;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toEqual('false');

      // Aria-HasPopup entfernen
      ariaHasPopup = undefined;
      component.ariaHasPopup = ariaHasPopup;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-haspopup')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button
      luxIconName="lux-interface-alert-alarm-bell-2"
      [luxAriaHasPopup]="ariaHasPopup"
      luxAriaHasPopupSelector="button"
    ></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaHaspopupDirective]
})
class LuxWithSelectorComponent {
  ariaHasPopup?: boolean | undefined;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaHasPopup]="ariaHasPopup"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaHaspopupDirective]
})
class LuxWithoutSelectorComponent {
  ariaHasPopup?: boolean | undefined;
}
