import {
  applicationConfig,
  type Preview,
  componentWrapperDecorator,
  moduleMetadata
} from '@analogjs/storybook-angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../projects/lux-components-lib/documentation.json';
import 'zone.js';
import '@angular/localize/init';
import { provideHttpClient } from '@angular/common/http';
import {
  Component, effect,
  inject, input
} from '@angular/core';
import { LuxThemeService } from '@ihk-gfi/lux-components';
import './styles.scss';

setCompodocJson(docJson);

@Component({
  selector: 'lux-theme-wrapper',
  template: '<ng-content></ng-content>'
})
class ThemeWrapperComponent {
  private readonly themeService = inject(LuxThemeService);
  theme = input('authentic', {
    transform: (value: string) => {
      switch (value) {
        case 'Authentic':
          return 'authentic';
        case 'Green':
          return 'green';
        default:
          return 'authentic';
      }
    }
  });

  constructor() {
    this.themeService.setTheme(this.theme());
    this.themeService.loadTheme();
    effect(() => {
      this.themeService.setTheme(this.theme());
      this.themeService.loadTheme();
    });
  }
}

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideHttpClient()]
    }),
    moduleMetadata({
      imports: [ThemeWrapperComponent]
    }),
    componentWrapperDecorator(ThemeWrapperComponent, ({ globals }) => ({
      theme: globals['theme']
    }))
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      disable: true
    },
    toolbar: {
      zoom: { hidden: true },
    }
  },

  globalTypes: {
    theme: {
      name: 'Lux-Theme',
      description: 'Lux-Theme für die Storybook-Darstellung',
      toolbar: {
        icon: 'mirror',
        items: ['Authentic', 'Green'],
        title: 'Lux-Theme',
        showName: true,
      },
    },
  }
};

export default preview;
