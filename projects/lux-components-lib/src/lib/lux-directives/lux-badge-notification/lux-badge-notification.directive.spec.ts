import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxBadgeNotificationDirective } from './lux-badge-notification.directive';

describe('LuxBadgeNotificationDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mockComp: MockComponent;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MockComponent);
    mockComp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Sollte die Notification anzeigen', fakeAsync(() => {
    // Vorbedingungen testen
    const badgeContent = fixture.debugElement.query(By.css('span'));

    expect(badgeContent.nativeElement.children.length).toEqual(0);

    // Änderungen durchführen
    mockComp.notification.set('1');
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(badgeContent.nativeElement.children[0].children[0].textContent.trim()).toEqual('1');
  }));

  it('Sollte die Notification verstecken', fakeAsync(() => {
    // Vorbedingungen testen
    mockComp.notification.set('1');
    LuxTestHelper.wait(fixture);
    expect(fixture.debugElement.query(By.css('.mat-badge-hidden'))).toBeNull();

    // Änderungen durchführen
    mockComp.hidden.set(true);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(fixture.debugElement.query(By.css('.mat-badge-hidden'))).not.toBeNull();
  }));

  it('Sollte die Notification deaktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    mockComp.notification.set('1');
    LuxTestHelper.wait(fixture);
    expect(fixture.debugElement.query(By.css('.mat-badge-disabled'))).toBeNull();

    // Änderungen durchführen
    mockComp.disabled.set(true);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(fixture.debugElement.query(By.css('.mat-badge-disabled'))).not.toBeNull();
  }));

  it('Sollte den Inhalt anhand von luxMaxNumber abkürzen', fakeAsync(() => {
    // Vorbedingungen testen
    mockComp.notification.set('100');
    LuxTestHelper.wait(fixture);

    const badgeContent = fixture.debugElement.query(By.css('span'));
    expect(badgeContent.nativeElement.children[0].children[0].textContent.trim()).toEqual('100');

    // Änderungen durchführen
    mockComp.maxNumber.set(90);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(badgeContent.nativeElement.children[0].children[0].textContent.trim()).toEqual('90+');
  }));
});

@Component({
  selector: 'lux-mock-component',
  template: `
    <span
      class="badge-target"
      [luxBadgeNotification]="notification()"
      [luxBadgeDisabled]="disabled()"
      [luxBadgeHidden]="hidden()"
      [luxBadgeCap]="maxNumber()"
    >
      Test
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxBadgeNotificationDirective]
})
class MockComponent {
  readonly notification = signal('');
  readonly disabled = signal(false);
  readonly hidden = signal(false);
  readonly maxNumber = signal(0);

  constructor() {}
}
