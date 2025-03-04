// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaRoleDirective } from './lux-aria-role.directive';

describe('LuxAriaRoleDirective', () => {
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

    it('Sollte role in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('role')).toBeNull();

      // role setzen
      let ariaRole: string | undefined = 'menubar';
      component.ariaRole = ariaRole;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('role')).toEqual(ariaRole);

      // role aktualisieren
      ariaRole = 'menuitem';
      component.ariaRole = ariaRole;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('role')).toEqual(ariaRole);

      // role entfernen
      ariaRole = undefined;
      component.ariaRole = ariaRole;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('role')).toBeNull();
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

    it('Sollte role in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('role')).toBeNull();

      // role setzen
      let ariaRole: string | undefined = 'menubar';
      component.ariaRole = ariaRole;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('role')).toEqual(ariaRole);

      // role aktualisieren
      ariaRole = 'menuitem';
      component.ariaRole = ariaRole;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('role')).toEqual(ariaRole);

      // role entfernen
      ariaRole = undefined;
      component.ariaRole = ariaRole;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('lux-button')).nativeElement.getAttribute('role')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaRole]="ariaRole" luxAriaRoleSelector="button"></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaRoleDirective]
})
class LuxWithSelectorComponent {
  ariaRole?: string;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaRole]="ariaRole"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaRoleDirective]
})
class LuxWithoutSelectorComponent {
  ariaRole?: string;
}
