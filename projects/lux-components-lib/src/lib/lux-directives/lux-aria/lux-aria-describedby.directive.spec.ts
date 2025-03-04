// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaDescribedbyDirective } from './lux-aria-describedby.directive';

describe('LuxAriaDescribedbyDirective', () => {
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

    it('Sollte describedby in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toBeNull();

      // describedby setzen
      let ariaDescribedby: string | undefined = 'menubar';
      component.ariaDescribedby = ariaDescribedby;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toEqual(ariaDescribedby);

      // describedby aktualisieren
      ariaDescribedby = 'menuitem';
      component.ariaDescribedby = ariaDescribedby;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toEqual(ariaDescribedby);

      // describedby entfernen
      ariaDescribedby = undefined;
      component.ariaDescribedby = ariaDescribedby;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toBeNull();
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

    it('Sollte describedby in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toBeNull();

      // describedby setzen
      let ariaDescribedby: string | undefined = 'menubar';
      component.ariaDescribedby = ariaDescribedby;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toEqual(ariaDescribedby);

      // describedby aktualisieren
      ariaDescribedby = 'menuitem';
      component.ariaDescribedby = ariaDescribedby;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toEqual(ariaDescribedby);

      // describedby entfernen
      ariaDescribedby = undefined;
      component.ariaDescribedby = ariaDescribedby;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-describedby')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button
      luxIconName="lux-interface-alert-alarm-bell-2"
      [luxAriaDescribedby]="ariaDescribedby"
      luxAriaDescribedbySelector="button"
    ></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaDescribedbyDirective]
})
class LuxWithSelectorComponent {
  ariaDescribedby?: string | undefined;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaDescribedby]="ariaDescribedby"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaDescribedbyDirective]
})
class LuxWithoutSelectorComponent {
  ariaDescribedby?: string | undefined;
}
