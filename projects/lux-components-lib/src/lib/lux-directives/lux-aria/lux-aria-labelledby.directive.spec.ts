// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaLabelledbyDirective } from './lux-aria-labelledby.directive';

describe('LuxAriaLabelledbyDirective', () => {
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

    it('Sollte labelledby in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toBeNull();

      // labelledby setzen
      let ariaLabelledBy: string | undefined = 'menubar';
      component.ariaLabelledby = ariaLabelledBy;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toEqual(ariaLabelledBy);

      // labelledby aktualisieren
      ariaLabelledBy = 'menuitem';
      component.ariaLabelledby = ariaLabelledBy;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toEqual(ariaLabelledBy);

      // labelledby entfernen
      ariaLabelledBy = undefined;
      component.ariaLabelledby = ariaLabelledBy;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toBeNull();
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

    it('Sollte labelledby in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toBeNull();

      // labelledby setzen
      let ariaLabelledBy: string | undefined = 'menubar';
      component.ariaLabelledby = ariaLabelledBy;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toEqual(ariaLabelledBy);

      // labelledby aktualisieren
      ariaLabelledBy = 'menuitem';
      component.ariaLabelledby = ariaLabelledBy;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toEqual(ariaLabelledBy);

      // labelledby entfernen
      ariaLabelledBy = undefined;
      component.ariaLabelledby = ariaLabelledBy;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-labelledby')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button
      luxIconName="lux-interface-alert-alarm-bell-2"
      [luxAriaLabelledby]="ariaLabelledby"
      luxAriaLabelledbySelector="button"
    ></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaLabelledbyDirective]
})
class LuxWithSelectorComponent {
  ariaLabelledby?: string;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaLabelledby]="ariaLabelledby"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaLabelledbyDirective]
})
class LuxWithoutSelectorComponent {
  ariaLabelledby?: string;
}
