// noinspection DuplicatedCode
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaLabelDirective } from './lux-aria-label.directive';

describe('LuxAriaLabelDirective', () => {
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

    it('Sollte aria-label in den HTML-Button rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toBeNull();

      // Aria-Label setzen
      let ariaLabel: string | undefined = 'Nachrichten anzeigen';
      component.ariaLabel = ariaLabel;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toEqual(ariaLabel);

      // Aria-Label aktualisieren
      ariaLabel = 'Keine Nachrichten vorhanden';
      component.ariaLabel = ariaLabel;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toEqual(ariaLabel);

      // Aria-Label entfernen
      ariaLabel = undefined;
      component.ariaLabel = ariaLabel;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toBeNull();
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

    it('Sollte aria-label in den LUX-BUTTON rendern', () => {
      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toBeNull();

      // Aria-Label setzen
      let ariaLabel: string | undefined = 'Nachrichten anzeigen';
      component.ariaLabel = ariaLabel;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toEqual(ariaLabel);

      // Aria-Label aktualisieren
      ariaLabel = 'Keine Nachrichten vorhanden';
      component.ariaLabel = ariaLabel;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toEqual(ariaLabel);

      // Aria-Label entfernen
      ariaLabel = undefined;
      component.ariaLabel = ariaLabel;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('button')).nativeElement.getAttribute('aria-label')).toBeNull();
    });
  });
});

@Component({
  selector: 'lux-with-selector',
  template: `
    <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaLabel]="ariaLabel" luxAriaLabelSelector="button"></lux-button>
  `,
  imports: [LuxButtonComponent, LuxAriaLabelDirective]
})
class LuxWithSelectorComponent {
  ariaLabel?: string;
}

@Component({
  selector: 'lux-without-selector',
  template: ` <lux-button luxIconName="lux-interface-alert-alarm-bell-2" [luxAriaLabel]="ariaLabel"></lux-button> `,
  imports: [LuxButtonComponent, LuxAriaLabelDirective]
})
class LuxWithoutSelectorComponent {
  ariaLabel?: string;
}
