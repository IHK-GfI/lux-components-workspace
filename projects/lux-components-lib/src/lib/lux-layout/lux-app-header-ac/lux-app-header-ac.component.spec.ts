import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxAppHeaderAcComponent } from './lux-app-header-ac.component';

describe('LuxAppHeaderAcComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  describe('luxClicked', () => {
    it('App-Title sollte angezeigt werden ', async () => {
      const fixture = TestBed.createComponent(MockIconsClickedAppHeaderAcComponent);
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('.lux-app-title'));

      fixture.detectChanges();

      expect(element).toBeDefined();
    });
  });
});

@Component({
  template: `
    <lux-app-header-ac luxAppTitle="MyClickTitle" luxAppIconSrc="assets/svg/demoAppLogo.svg" (luxAppLogoClicked)="onClicked()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAppHeaderAcComponent]
})
class MockIconsClickedAppHeaderAcComponent {
  onClicked() {}
}
