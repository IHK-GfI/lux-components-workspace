import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxLookupAutocompleteComponent } from './lux-lookup-autocomplete.component';

const meta: Meta<LuxLookupAutocompleteComponent> = {
  title: 'Lookup/lux-lookup-autocomplete',
  component: LuxLookupAutocompleteComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Lookup Autocomplete',
    luxLookupId: 'storybook-lookup-autocomplete',
    luxTableNo: '1002',
    luxRenderProp: 'kurzText',
    luxPlaceholder: 'Eingeben zum Suchen'
  }
};

export default meta;
type Story = StoryObj<LuxLookupAutocompleteComponent>;

export const Default: Story = {};

export const Clearable: Story = {
  args: {
    luxClearable: true,
    luxClearAriaLabel: 'Eingabe löschen'
  }
};

export const WithHint: Story = {
  args: {
    luxHint: 'Mindestens drei Zeichen eingeben.',
    luxDebounceTime: 400
  }
};
