import '@angular/localize/init';
import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from './documentation.json';
import { applicationConfig } from '@storybook/angular';
import { APP_INITIALIZER, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LuxThemeService } from '../src/lib/lux-theme/lux-theme.service';
import 'zone.js';

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideAnimations(),
        {
          provide: APP_INITIALIZER,
          useFactory: () => {
            return () => {
              const luxThemeService = inject(LuxThemeService);
              luxThemeService.setTheme('authentic');
            };
          },
          multi: true,
          deps: [LuxThemeService]
        }
      ]
    })
  ]
};

export default preview;
