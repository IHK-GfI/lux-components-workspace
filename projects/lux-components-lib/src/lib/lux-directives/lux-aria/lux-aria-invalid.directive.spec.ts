// noinspection DuplicatedCode
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaInvalidDirective } from './lux-aria-invalid.directive';

describe('LuxAriaInvalidDirective', () => {
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

    it('Sollte aria-invalid in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-invalid')).toBeNull();

      // aria-invalid setzen
      let ariaInvalid: string | undefined = 'true';
      component.ariaInvalid = ariaInvalid;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-invalid')).toEqual(ariaInvalid);

      // aria-invalid aktualisieren
      ariaInvalid = 'false';
      component.ariaInvalid = ariaInvalid;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-invalid')).toEqual(ariaInvalid);

      // aria-invalid entfernen
      ariaInvalid = undefined;
      component.ariaInvalid = ariaInvalid;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-invalid')).toBeNull();
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

    it('Sollte aria-invalid in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-invalid')).toBeNull();

      // aria-invalid setzen
      let ariaInvalid: string | undefined = 'true';
      component.ariaInvalid = ariaInvalid;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-invalid')).toEqual(ariaInvalid);

      // aria-invalid aktualisieren
      ariaInvalid = 'spelling';
      component.ariaInvalid = ariaInvalid;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-invalid')).toEqual(ariaInvalid);

      // aria-invalid entfernen
      ariaInvalid = undefined;
      component.ariaInvalid = ariaInvalid;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('aria-invalid')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaInvalid]="ariaInvalid" luxAriaInvalidSelector="button"></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaInvalidDirective]
})
class LuxWithSelectorComponent {
  ariaInvalid?: string;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaInvalid]="ariaInvalid"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaInvalidDirective]
})
class LuxWithoutSelectorComponent {
  ariaInvalid?: string;
}
