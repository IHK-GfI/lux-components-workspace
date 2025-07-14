import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { LuxLangSelectComponent } from './lux-lang-select.component';

describe('LuxLangSelectComponent', () => {
  let component: LuxLangSelectComponent;
  let fixture: ComponentFixture<LuxLangSelectComponent>;
  let cookieService: MockCookieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxLangSelectComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: CookieService, useClass: MockCookieService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    cookieService = TestBed.inject(CookieService) as any;
  });

  it('should create', () => {
    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    component.luxLocaleSupported = ['de', 'en'];
    expect(component).toBeTruthy();
  });

  it('should set default locale de (not set)', () => {
    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    component.luxLocaleSupported = ['de', 'en'];
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[0]);
  });

  it('should set default locale de (unsupported locale)', () => {
    cookieService.set('X-GFI-LANGUAGE', 'no');
    component.luxLocaleSupported = ['de', 'en'];
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[0]);
  });

  it('should generate url (de - root)', () => {
    component.luxLocaleSupported = ['de', 'en'];
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[0]);

    const urlDeEn = component.generateNewUrl(component.allSupportedLocaleArr[0], 'http://localhost:4200', 'http://localhost:4200');
    expect(urlDeEn).toEqual('http://localhost:4200/');
  });

  it('should generate url (de -> en)', () => {
    cookieService.set('X-GFI-LANGUAGE', 'de');
    component.luxLocaleSupported = ['de', 'en'];
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[0]);

    const urlDeEn = component.generateNewUrl(
      component.allSupportedLocaleArr[1],
      'http://localhost:4200/information',
      'http://localhost:4200'
    );
    expect(urlDeEn).toEqual('http://localhost:4200/en/information');
  });

  it('should generate url (de -> en - with BaseHref)', () => {
    cookieService.set('X-GFI-LANGUAGE', 'de');
    component.luxLocaleSupported = ['de', 'en'];
    component.luxLocaleBaseHref = '/webcomponent/';
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[0]);

    const urlDeEn = component.generateNewUrl(
      component.allSupportedLocaleArr[1],
      'http://localhost:4200/webcomponent/information',
      'http://localhost:4200'
    );
    expect(urlDeEn).toEqual('http://localhost:4200/webcomponent/en/information');
  });

  it('should generate url (en -> de)', () => {
    cookieService.set('X-GFI-LANGUAGE', 'en');
    component.luxLocaleSupported = ['de', 'en'];
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[1]);

    const urlEnDe = component.generateNewUrl(
      component.allSupportedLocaleArr[0],
      'http://localhost:4200/en/information',
      'http://localhost:4200'
    );
    expect(urlEnDe).toEqual('http://localhost:4200/information');
  });

  it('should generate url (en -> de - with BaseHref)', () => {
    cookieService.set('X-GFI-LANGUAGE', 'en');
    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    component.luxLocaleSupported = ['de', 'en'];
    component.luxLocaleBaseHref = '/webcomponent/test/';
    fixture.detectChanges();
    expect(component.selectedLocale).toEqual(component.allSupportedLocaleArr[1]);

    const urlEnDe = component.generateNewUrl(
      component.allSupportedLocaleArr[0],
      'http://localhost:4200/webcomponent/test/en/information',
      'http://localhost:4200'
    );
    expect(urlEnDe).toEqual('http://localhost:4200/webcomponent/test/information');
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