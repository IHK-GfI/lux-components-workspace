import type { Meta, StoryObj } from '@storybook/angular';
import { LuxAutocompleteAcComponent } from './lux-autocomplete-ac.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AutocompleteAuthenticExampleComponent
} from '../../../../../demo-app/src/app/components-overview/autocomplete-authentic-example/autocomplete-authentic-example.component';

const meta: Meta<LuxAutocompleteAcComponent> = {
  title: 'Lux Components/Form/LuxAutocompleteAc',
  component: LuxAutocompleteAcComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, AutocompleteAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxAutocompleteAcComponent>;

const options = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
  { id: 4, name: 'Date' },
  { id: 5, name: 'Elderberry' },
  { id: 6, name: 'Fig' },
  { id: 7, name: 'Grape' },
  { id: 8, name: 'Honeydew' },
  { id: 9, name: 'Kiwi' },
  { id: 10, name: 'Lemon' },
];

export const Default: Story = {
  args: {
    luxOptions: options,
    luxOptionLabelProp: 'name',
    luxPlaceholder: 'Search for a fruit',
    luxLabel: 'Fruit',
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<lux-autocomplete-authentic-example></lux-autocomplete-authentic-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

