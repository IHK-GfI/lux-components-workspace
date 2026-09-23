import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxIconComponent } from './lux-icon.component';

describe('LuxIconComponent', () => {
  describe('Attribut "luxIconName"', () => {
    let fixture: ComponentFixture<LuxMockIconComponent>;
    let testComponent: LuxMockIconComponent;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
      }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxMockIconComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Icon setzen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.iconName).toEqual('lux-interface-setting-cog');

      // Änderungen durchführen
      const expectedIcon = 'lux-interface-setting-cog';
      fixture.componentInstance.iconName = expectedIcon;
      fixture.detectChanges();

      // Nachbedingungen testen
      const newIconEl = fixture.debugElement.query(By.css('lux-icon'));
      expect(fixture.componentInstance.iconName).toEqual(expectedIcon);
      expect(newIconEl.nativeElement.innerHTML).toContain(expectedIcon);
    }));

    it('Unbekanntes Icon fuehrt zur Anzeige des Warn-Icons', fakeAsync(() => {
      spyOn(console, 'warn');

      // Änderungen durchführen
      fixture.componentInstance.iconName = 'lux-nicht-vorhandenes-icon';
      fixture.detectChanges();

      // Nachbedingungen testen
      const iconComponent = fixture.debugElement.query(By.directive(LuxIconComponent)).componentInstance as LuxIconComponent;
      expect(console.warn).toHaveBeenCalled();
      expect(iconComponent.luxIconName).toEqual('lux-interface-alert-warning-diamond');

      const matIconEl = fixture.debugElement.query(By.css('mat-icon'));
      expect(matIconEl.nativeElement.getAttribute('data-mat-icon-name')).toEqual('lux-interface-alert-warning-diamond');
    }));
  });
});

@Component({
  template: ` <lux-icon [luxIconName]="iconName" [luxIconSize]="iconSize"></lux-icon> `,
  imports: [LuxIconComponent]
})
class LuxMockIconComponent {
  iconName = 'lux-interface-setting-cog';
  iconSize = '2x';
}
