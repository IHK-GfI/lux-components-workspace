import { applicationConfig, type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaselineComponent } from './baseline/baseline.component';
import { BaselineAccordionComponent } from './baseline-accordion/baseline-accordion.component';
import { BaselineCardComponent } from './baseline-card/baseline-card.component';

const meta: Meta = {
  title: 'Allgemein/Baseline',
  parameters: {
    controls: {
      disable: true
    }
  },
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)]
    }),
    moduleMetadata({
      imports: [BaselineComponent, BaselineCardComponent, BaselineAccordionComponent]
    })

  ]
};

export default meta;

type Story = StoryObj;

export const Baseline: Story = {
  render: () => ({
    template: `<lux-baseline></lux-baseline>`
  })
};

export const BaselineCard: Story = {
  render: () => ({
    template: `<lux-baseline-card></lux-baseline-card>`
  })
};

export const BaselineAccordion: Story = {
  render: () => ({
    template: `<lux-baseline-accordion></lux-baseline-accordion>`
  })
};
