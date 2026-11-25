import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  LuxAppHeaderComponent,
  LuxAppHeaderRightNavComponent,
  LuxMenuItemComponent,
  LuxSideNavComponent,
  LuxStorageService
} from '@ihk-gfi/lux-components';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../../src/testing/transloco-test.provider';
import { LuxSnackbarService } from '../lux-snackbar.service';

describe('LuxSnackbarComponent', () => {
  let fixture: ComponentFixture<MockSnackbarComponent>;
  let snackbarService: LuxSnackbarService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [MockSnackbarComponent],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        { provide: LuxStorageService, useClass: MockStorageService }
      ]
    });

    fixture = TestBed.createComponent(MockSnackbarComponent);
    fixture.detectChanges();
    snackbarService = TestBed.inject(LuxSnackbarService);
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
  });

  it('Sollte nicht den lux-app-header überlagern', async () => {
    // Vorbedingungen testen
    // jsdom hat keine Layout-Engine und implementiert document.elementFromPoint() nicht; der Trigger wird
    // deshalb direkt über die CSS-Klasse ermittelt und geprüft, dass der Klick ihn trotz Snackbar erreicht.
    const toggleElement: HTMLButtonElement = fixture.debugElement.query(By.css('.lux-menu-trigger')).nativeElement;
    const spy = vi.spyOn(toggleElement, 'click');

    toggleElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);

    // Änderungen durchführen
    snackbarService.open(200, {
      text: 'Hallo Test'
    });
    fixture.detectChanges();

    // Nachbedingungen testen
    toggleElement.click();
    await LuxTestHelper.wait(fixture, 300);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('Sollte Text, Icon und Action darstellen', async () => {
    const ref = snackbarService.open(0, { text: '  Gespeichert  ', type: 'success', action: 'Ok' });
    await LuxTestHelper.wait(fixture);

    const snackbarEl = document.querySelector('.lux-snackbar') as HTMLElement;
    expect(snackbarEl.querySelector('.lux-snackbar-text')?.textContent?.trim()).toEqual('Gespeichert');
    expect(snackbarEl.querySelector('lux-icon')).not.toBeNull();
    expect(snackbarEl.classList).toContain('lux-snackbar-type-success');
    expect(snackbarEl.classList).toContain('lux-snackbar-color-icon-green');

    const actionSpy = vi.fn();
    const dismissSpy = vi.fn();
    ref.onAction().subscribe(actionSpy);
    ref.afterDismissed().subscribe(dismissSpy);

    (snackbarEl.querySelector('.lux-snackbar-action') as HTMLButtonElement).click();
    await LuxTestHelper.wait(fixture);

    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledWith({ dismissedByAction: true });
    expect(document.querySelector('.lux-snackbar')).toBeNull();
  });

  it('Sollte ohne Icon-Name kein Icon darstellen', async () => {
    snackbarService.openText('Nur Text', 0);
    await LuxTestHelper.wait(fixture);

    const snackbarEl = document.querySelector('.lux-snackbar') as HTMLElement;
    expect(snackbarEl.querySelector('.lux-snackbar-icon')).toBeNull();
    expect(snackbarEl.querySelector('.lux-snackbar-action')).toBeNull();
  });
});

@Component({
  template: `
    <lux-app-header>
      <lux-side-nav />
      <lux-app-header-right-nav>
        <lux-menu-item luxLabel="Test" />
      </lux-app-header-right-nav>
    </lux-app-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAppHeaderComponent, LuxSideNavComponent, LuxAppHeaderRightNavComponent, LuxMenuItemComponent]
})
class MockSnackbarComponent {}

@Injectable()
class MockStorageService {
  getItem() {
    return 1;
  }

  removeItem() {}
}
