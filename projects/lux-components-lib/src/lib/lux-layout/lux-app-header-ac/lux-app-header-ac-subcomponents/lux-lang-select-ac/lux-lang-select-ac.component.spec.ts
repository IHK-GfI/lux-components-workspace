import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { CookieService } from 'ngx-cookie-service';
import { provideLuxTranslocoTesting } from '../../../../../testing/transloco-test.provider';
import { LuxLangSelectAcComponent } from './lux-lang-select-ac.component';

describe('LuxLangSelectAcComponent', () => {
  let component: LuxLangSelectAcComponent;
  let fixture: ComponentFixture<LuxLangSelectAcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        { provide: CookieService, useClass: MockCookieService }
      ]
    }).compileComponents();
  });

  it('should create', (done) => {
    fixture = TestBed.createComponent(LuxLangSelectAcComponent);
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
  locale: string | undefined = 'de';

  get(name: string) {
    return this.locale;
  }

  set(name: string, value: string) {
    this.locale = value;
  }
}
