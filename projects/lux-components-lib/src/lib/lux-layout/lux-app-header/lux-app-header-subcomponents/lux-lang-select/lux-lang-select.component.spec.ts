import { describe, it, beforeEach, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { CookieService } from 'ngx-cookie-service';
import { provideLuxTranslocoTesting } from '../../../../../testing/transloco-test.provider';
import { LuxLangSelectComponent } from './lux-lang-select.component';

describe('LuxLangSelectComponent', () => {
  let component: LuxLangSelectComponent;
  let fixture: ComponentFixture<LuxLangSelectComponent>;
  let cookieService: MockCookieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxLangSelectComponent],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        { provide: CookieService, useClass: MockCookieService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    cookieService = TestBed.inject(CookieService) as any;
  });

  it('should create', async () => {
    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('luxLocaleSupported', ['de', 'en']);
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      const transloco = TestBed.inject(TranslocoService);
      expect(component).toBeTruthy();
      expect(['de', 'en']).toContain(transloco.getActiveLang());
    });
  });

  it('sollte die Sprache wechseln und das Cookie setzen', () => {
    const transloco = TestBed.inject(TranslocoService);
    fixture.componentRef.setInput('luxLocaleSupported', ['de', 'en']);
    fixture.detectChanges();

    component.onLocaleChanged(component.localeOptions.find((locale) => locale.code === 'en')!);

    expect(transloco.getActiveLang()).toBe('en');
    expect(cookieService.get(component.cookieName)).toBe('en');
  });

  it('sollte bei einem Ladefehler die bisherige Sprache behalten und kein Cookie setzen', () => {
    const transloco = TestBed.inject(TranslocoService);
    fixture.componentRef.setInput('luxLocaleSupported', ['de', 'en']);
    fixture.detectChanges();
    transloco.setActiveLang('en');
    vi.spyOn(transloco, 'load').mockReturnValue(throwError(() => new Error('Laden fehlgeschlagen')));

    component.onLocaleChanged(component.localeOptions.find((locale) => locale.code === 'de')!);

    expect(transloco.getActiveLang()).toBe('en');
    expect(cookieService.get(component.cookieName)).toBeUndefined();
  });

  it('sollte nicht wechseln, wenn load() nach einem Ladefehler die Fallback-Übersetzungen liefert', () => {
    const transloco = TestBed.inject(TranslocoService);
    fixture.componentRef.setInput('luxLocaleSupported', ['de', 'fr']);
    fixture.detectChanges();
    // So verhält sich Transloco mit fallbackLang: 'fr' schlägt fehl, load() liefert die Fallback-Übersetzungen.
    vi.spyOn(transloco, 'load').mockReturnValue(of(transloco.getTranslation('de')));

    component.onLocaleChanged(component.localeOptions.find((locale) => locale.code === 'fr')!);

    expect(transloco.getActiveLang()).toBe('de');
    expect(cookieService.get(component.cookieName)).toBeUndefined();
  });
});

class MockCookieService {
  private store: Record<string, string> = {};
  get(name: string) {
    return this.store[name];
  }
  set(name: string, value: string) {
    this.store[name] = value;
  }
}
