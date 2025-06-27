import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebFontDemoComponent } from './web-font-demo.component';
// @ts-ignore
import webFontDemoComponentSource from './web-font-demo.component.html?raw';

const meta: Meta<WebFontDemoComponent> = {
  title: 'Allgemein/Web Font Demo',
  component: WebFontDemoComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)]
    })
  ],
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<WebFontDemoComponent>;

export const WebFontDemo: Story = {
  parameters: {
    docs: {
      source: {
        code: webFontDemoComponentSource
      }
    }
  }
};

