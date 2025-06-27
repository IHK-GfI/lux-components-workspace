import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ConfigurationComponent } from './configuration.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableExampleDataProviderService } from '../form/table-example-data-provider.service';

const meta: Meta<ConfigurationComponent> = {
  title: 'Allgemein/Konfiguration',
  component: ConfigurationComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule), TableExampleDataProviderService]
    }),
    moduleMetadata({
      imports: [ConfigurationComponent]
    })
  ],
  parameters: {
    options: {
      showPanel: false

    }
  }
};

export default meta;
type Story = StoryObj<ConfigurationComponent>;


export const Default: Story = {};
