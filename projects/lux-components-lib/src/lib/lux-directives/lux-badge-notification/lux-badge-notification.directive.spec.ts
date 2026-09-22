import { describe, it, beforeEach, expect } from 'vitest';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxBadgeNotificationDirective } from './lux-badge-notification.directive';

describe('LuxBadgeNotificationDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mockComp: MockComponent;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MockComponent);
    mockComp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Sollte die Notification anzeigen', async () => {
    // Vorbedingungen testen
    const badgeContent = fixture.debugElement.query(By.css('span'));

    expect(badgeContent.nativeElement.children.length).toEqual(0);

    // Änderungen durchführen
    mockComp.notification.set('1');
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(badgeContent.nativeElement.children[0].children[0].textContent.trim()).toEqual('1');
  });

  it('Sollte die Notification verstecken', async () => {
    // Vorbedingungen testen
    mockComp.notification.set('1');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mat-badge-hidden'))).toBeNull();

    // Änderungen durchführen
    mockComp.hidden.set(true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(fixture.debugElement.query(By.css('.mat-badge-hidden'))).not.toBeNull();
  });

  it('Sollte die Notification deaktivieren', async () => {
    // Vorbedingungen testen
    mockComp.notification.set('1');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mat-badge-disabled'))).toBeNull();

    // Änderungen durchführen
    mockComp.disabled.set(true);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(fixture.debugElement.query(By.css('.mat-badge-disabled'))).not.toBeNull();
  });

  it('Sollte den Inhalt anhand von luxMaxNumber abkürzen', async () => {
    // Vorbedingungen testen
    mockComp.notification.set('100');
    fixture.detectChanges();

    const badgeContent = fixture.debugElement.query(By.css('span'));
    expect(badgeContent.nativeElement.children[0].children[0].textContent.trim()).toEqual('100');

    // Änderungen durchführen
    mockComp.maxNumber.set(90);
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(badgeContent.nativeElement.children[0].children[0].textContent.trim()).toEqual('90+');
  });
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
