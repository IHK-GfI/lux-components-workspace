// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaExpandedDirective } from './lux-aria-expanded.directive';

describe('LuxAriaExpandedDirective', () => {
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

    it('Sollte aria-expanded in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toBeNull();

      // Aria-expanded setzen
      let ariaExpanded: boolean | undefined = true;
      component.ariaExpanded = ariaExpanded;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toEqual('true');

      // Aria-expanded aktualisieren
      ariaExpanded = false;
      component.ariaExpanded = ariaExpanded;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toEqual('false');

      // Aria-expanded entfernen
      ariaExpanded = undefined;
      component.ariaExpanded = ariaExpanded;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toBeNull();
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

    it('Sollte aria-expanded in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toBeNull();

      // Aria-expanded setzen
      let ariaExpanded: boolean | undefined = true;
      component.ariaExpanded = ariaExpanded;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toEqual('true');

      // Aria-expanded aktualisieren
      ariaExpanded = false;
      component.ariaExpanded = ariaExpanded;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toEqual('false');

      // Aria-expanded entfernen
      ariaExpanded = undefined;
      component.ariaExpanded = ariaExpanded;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-expanded')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button
      luxIconName="lux-interface-alert-alarm-bell-2"
      [luxAriaExpanded]="ariaExpanded"
      luxAriaExpandedSelector="button"
    ></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaExpandedDirective]
})
class LuxWithSelectorComponent {
  ariaExpanded?: boolean | undefined;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaExpanded]="ariaExpanded"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaExpandedDirective]
})
class LuxWithoutSelectorComponent {
  ariaExpanded?: boolean | undefined;
}
