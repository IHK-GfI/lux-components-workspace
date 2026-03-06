import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { ILuxConsentConfig } from './lux-consent-config.interface';
import { LUX_CONSENT_DIALOG_LAUNCHER } from './lux-consent-dialog-launcher';
import { LuxConsentPurpose } from './lux-consent.model';
import { LUX_CONSENT_CONFIG, LuxConsentService } from './lux-consent.service';

describe('LuxConsentService (config overrides)', () => {
  const baseKey = 'consent-base-key';
  const overrideKey = 'consent-override-key';
  let cookieStore: Map<string, string>;
  let service: LuxConsentService;
  let openSpy: jasmine.Spy;

  beforeEach(() => {
    cookieStore = new Map<string, string>();
    openSpy = jasmine.createSpy('open').and.callFake((onClosed?: () => void, _onError?: (error: unknown) => void) => {
      if (onClosed) {
        onClosed();
      }
    });

    const cookieServiceMock = {
      check: (key: string) => cookieStore.has(key),
      get: (key: string) => cookieStore.get(key) ?? '',
      set: (...args: any[]) => {
        const [key, value] = args as [string, string];
        cookieStore.set(key, value);
      },
      delete: (...args: any[]) => {
        const [key] = args as [string];
        cookieStore.delete(key);
      }
    } as CookieService;

    const consentConfig: ILuxConsentConfig = {
      cookieKey: baseKey
    };

    TestBed.configureTestingModule({
      providers: [
        LuxConsentService,
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: LUX_CONSENT_CONFIG, useValue: consentConfig },
        { provide: LUX_CONSENT_DIALOG_LAUNCHER, useValue: { open: openSpy } }
      ]
    });

    service = TestBed.inject(LuxConsentService);
  });

  afterEach(() => {
    sessionStorage.removeItem(baseKey);
    sessionStorage.removeItem(overrideKey);
  });

  it('uses DI config by default', () => {
    service.acceptAll();

    expect(cookieStore.has(baseKey)).toBeTrue();
    expect(sessionStorage.getItem(baseKey)).toBeNull();
  });

  it('allows per-call cookieKey override', () => {
    service.openIfNeeded({ cookieKey: overrideKey });

    expect(openSpy).toHaveBeenCalled();
    expect(sessionStorage.getItem(overrideKey)).not.toBeNull();
    expect(sessionStorage.getItem(baseKey)).toBeNull();
  });

  it('does not open for existing override cookie and restores default state afterwards', () => {
    cookieStore.set(
      overrideKey,
      JSON.stringify({
        purposes: [LuxConsentPurpose.Essential, LuxConsentPurpose.Preferences],
        timestamp: new Date().toISOString()
      })
    );

    service.openIfNeeded({ cookieKey: overrideKey });

    expect(openSpy).not.toHaveBeenCalled();
    expect(service.hasConsent(LuxConsentPurpose.Preferences)).toBeFalse();
  });

  it('clears runtime override after open error', () => {
    openSpy.and.callFake((_onClosed?: () => void, onError?: (error: unknown) => void) => {
      onError?.(new Error('dialog import failed'));
    });

    service.open({ cookieKey: overrideKey });
    service.acceptAll();

    expect(cookieStore.has(baseKey)).toBeTrue();
  });
});
