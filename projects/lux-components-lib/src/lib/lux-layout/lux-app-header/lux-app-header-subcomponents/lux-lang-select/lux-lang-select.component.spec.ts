import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        { provide: CookieService, useClass: MockCookieService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    cookieService = TestBed.inject(CookieService) as any;
  });

  it('should create', (done) => {
    fixture = TestBed.createComponent(LuxLangSelectComponent);
    component = fixture.componentInstance;
    component.luxLocaleSupported = ['de', 'en'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const transloco = TestBed.inject(TranslocoService);
      expect(component).toBeTruthy();
      expect(['de', 'en']).toContain(transloco.getActiveLang());
      done();
    });
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
