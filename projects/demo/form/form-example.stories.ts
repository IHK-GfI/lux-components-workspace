import { applicationConfig, type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TableExampleDataProviderService } from './table-example-data-provider.service';
import { FormThreeColComponent } from './form-three-col/form-three-col.component';
import { FormDualColComponent } from './form-dual-col/form-dual-col.component';
import { FormSingleColComponent } from './form-single-col/form-single-col.component';

// @ts-ignore
import formThreeColSource from './form-three-col/form-three-col.component.html?raw';
// @ts-ignore
import formSingleColSource from './form-single-col/form-single-col.component.html?raw';
// @ts-ignore
import formDualColSource from './form-dual-col/form-dual-col.component.html?raw';

const meta: Meta = {
  title: 'Allgemein/Mehrspaltige Formulare',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule), TableExampleDataProviderService]
    }),
    moduleMetadata({
      imports: [FormSingleColComponent, FormDualColComponent, FormThreeColComponent]
    })
  ],
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj;

export const ShowNone: Story = {
  render: () => ({
    template: ``
  }),
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      disable: true
    }
  }
};

export const EineKarte: Story = {
  render: () => ({
    template: `<app-form-single-col></app-form-single-col>`
  }),
  parameters: {
    docs: {
      source: {
        code: formSingleColSource
      }
    },
    controls: {
      disable: true
    }
  }
};

export const ZweiKarten: Story = {
  render: () => ({
    template: `<app-form-dual-col></app-form-dual-col>`
  })
  ,
  parameters: {
    docs: {
      source: {
        code: formDualColSource
      }
    },
    controls: {
      disable: true
    }
  }
};

export const DreiKarten: Story = {
  render: () => ({
    template: `<app-form-three-col></app-form-three-col>`
  }),
  parameters: {
    docs: {
      source: {
        code: formThreeColSource
      }
    }
  }
};
