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
