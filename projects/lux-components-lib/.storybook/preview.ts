import { provideHttpClient } from '@angular/common/http';
import type { Preview } from '@storybook/angular-vite';
import { applicationConfig } from '@storybook/angular-vite';
import { provideLuxTranslocoTesting } from '../src/testing/transloco-test.provider';
import './storybook.scss';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(), provideLuxTranslocoTesting()]
    })
  ],
  tags: ['autodocs']
};

export default preview;
