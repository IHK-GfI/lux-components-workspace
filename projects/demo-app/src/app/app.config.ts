import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LuxAppHeaderAcSessionTimerService, LuxComponentsConfigModule, LuxComponentsConfigParameters } from '@ihk-gfi/lux-components';
import { LangDefinition, TranslocoService } from '@jsverse/transloco';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideLuxTranslocoRoot } from './transloco-root.config';
import { MockAppHeaderAcLuxSessionTimerService } from './components-overview/session-timer-example/mock-session-timer-service';

const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: environment.generateLuxTagIds,
  iconBasePath: 'https://cdn.gfi.ihk.de/lux-components/icons-and-fonts/v1.10.0/',
  labelConfiguration: {
    allUppercase: false,
    notAppliedTo: ['lux-link', 'lux-menu-item', 'lux-side-nav-item', 'lux-tab', 'lux-step']
  },
  sessionTimerConfig: {
    url: '/session'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom([LuxComponentsConfigModule.forRoot(myConfiguration)]),
    provideHttpClient(withFetch()),
    provideLuxTranslocoRoot(),
    CookieService,
    provideAppInitializer(() => {
      // Dependencies per inject() to avoid deprecated APP_INITIALIZER pattern.
      const t = inject(TranslocoService);
      const cookieService = inject(CookieService);

      // Sprache aus CookieService auslesen (gleiches Cookie wie LuxLangSelectAcComponent)
      const cookieLang = cookieService.get('X-GFI-LANGUAGE');
      const available = t.getAvailableLangs().map((l) => (l as LangDefinition).id);
      const chosen = cookieLang && available.includes(cookieLang) ? cookieLang : 'de';

      // Sprache setzen bevor Komponenten erstellt werden.
      t.setActiveLang(chosen);
      // Sicherstellen, dass Ressourcen geladen sind bevor Bootstrap finalisiert.
      return firstValueFrom(t.load(chosen));
    }),
    { provide: LuxAppHeaderAcSessionTimerService, useClass: MockAppHeaderAcLuxSessionTimerService }
  ]
};
