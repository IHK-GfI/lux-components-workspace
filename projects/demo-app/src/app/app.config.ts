import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LuxComponentsConfigModule, LuxComponentsConfigParameters, LuxSessionTimerService } from '@ihk-gfi/lux-components';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { MockLuxSessionTimerService } from './components-overview/session-timer-example/mock-session-timer-service';

const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: environment.generateLuxTagIds,
  iconBasePath: 'https://cdn.gfi.ihk.de/lux-components/icons-and-fonts/v1.10.0/',
  labelConfiguration: {
    allUppercase: false,
    notAppliedTo: ['lux-link', 'lux-menu-item', 'lux-side-nav-item', 'lux-tab', 'lux-step']
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom([LuxComponentsConfigModule.forRoot(myConfiguration)]),
    provideHttpClient(withFetch()),
    { provide: LuxSessionTimerService, useClass: MockLuxSessionTimerService }
  ]
};
