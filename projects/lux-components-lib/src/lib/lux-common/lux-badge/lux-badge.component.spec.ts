import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxLabelComponent } from '../lux-label/lux-label.component';
import { LuxBadgeComponent } from './lux-badge.component';

describe('LuxBadgeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  describe('ng-content "lux-label"', () => {
    let fixture: ComponentFixture<MockBadgeComponent>;
    let testComponent: MockBadgeComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockBadgeComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Wert über die Component setzen', fakeAsync(() => {
      // Vorbedingungen testen
      const badgeEl = fixture.debugElement.query(By.css('#badgeLabel'));
      expect(fixture.componentInstance.label).toEqual('Test 4711');
      expect(badgeEl.nativeElement.innerHTML.trim()).toEqual('Test 4711');

      // Änderungen durchführen
      const expectedLabel = 'New Lorem ipsum 123';
      fixture.componentInstance.label = expectedLabel;
      fixture.detectChanges();

      // Nachbedingungen testen
      expect(fixture.componentInstance.label).toEqual(expectedLabel);
      expect(badgeEl.nativeElement.innerHTML.trim()).toEqual(expectedLabel);
    }));
  });

  describe('Attribut "luxIconName"', () => {
    let fixture: ComponentFixture<MockBadgeIconNameComponent>;
    let testComponent: MockBadgeIconNameComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockBadgeIconNameComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Wert über die Component setzen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(fixture.componentInstance.iconName).toEqual('lux-programming-bug');

      // Änderungen durchführen
      fixture.componentInstance.iconName = '';
      fixture.detectChanges();

      // Nachbedingungen testen
      const iconEl = fixture.debugElement.query(By.css('lux-icon'));
      expect(fixture.componentInstance.iconName).toEqual('');
      expect(iconEl).toBeNull();

      // Änderungen durchführen
      const expectedIcon = 'lux-interface-user-single';
      fixture.componentInstance.iconName = expectedIcon;
      fixture.detectChanges();

      // Nachbedingungen testen
      const newIconEl = fixture.debugElement.query(By.css('lux-icon'));
      expect(fixture.componentInstance.iconName).toEqual(expectedIcon);
      expect(newIconEl).not.toBeNull();
      expect(newIconEl.nativeElement.innerHTML).toContain(expectedIcon);
    }));
  });

  describe('Attribut "luxUppercase"', () => {
    let fixture: ComponentFixture<MockBadgeComponent>;
    let testComponent: MockBadgeComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockBadgeComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Wert über die Component setzen', fakeAsync(() => {
      // Vorbedingungen testen
      const badgeEl = fixture.debugElement.query(By.css('div[class~="lux-badge"]'));
      expect(fixture.componentInstance.label).toEqual('Test 4711');
      expect(fixture.componentInstance.uppercase).toEqual(true);
      expect(badgeEl.nativeElement.innerHTML).toContain('Test 4711');

      // Änderungen durchführen
      fixture.componentInstance.uppercase = false;
      fixture.detectChanges();

      // Nachbedingungen testen
      expect(fixture.componentInstance.uppercase).toBeFalsy();
      expect(badgeEl.nativeElement.classList).not.toContain('lux-badge-uppercase');

      // Änderungen durchführen
      fixture.componentInstance.uppercase = true;
      fixture.detectChanges();

      // Nachbedingungen testen
      expect(fixture.componentInstance.uppercase).toBeTruthy();
      expect(badgeEl.nativeElement.classList).toContain('lux-badge-uppercase');
    }));
  });
});

@Component({
  template: `
    <lux-badge [luxIconName]="iconName" luxColor="red" [luxUppercase]="uppercase">
      <lux-label luxId="badgeLabel">
        {{ label }}
      </lux-label>
    </lux-badge>
  `,
  imports: [LuxBadgeComponent, LuxLabelComponent]
})
class MockBadgeComponent {
  label = 'Test 4711';
  uppercase = true;
  iconName = 'lux-interface-setting-cog';
}

@Component({
  template: `
    <lux-badge [luxIconName]="iconName">
      <lux-label luxId="badgeLabel"> BVB </lux-label>
    </lux-badge>
  `,
  imports: [LuxBadgeComponent, LuxLabelComponent]
})
class MockBadgeIconNameComponent {
  iconName = 'lux-programming-bug';
}
