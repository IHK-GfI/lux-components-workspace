import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxInputComponent } from '../../lux-form/lux-input/lux-input.component';
import { LuxFilterItemDirective } from '../lux-filter-base/lux-filter-item.directive';
import { LuxFilterFormExtendedComponent } from './lux-filter-form-extended/lux-filter-form-extended.component';
import { LuxFilterFormComponent } from './lux-filter-form.component';

const storedFilters = [
  { id: '1', name: 'Aktive Kunden', data: {} },
  { id: '2', name: 'Offene Vorgänge', data: {} }
];

const meta: Meta<LuxFilterFormComponent> = {
  title: 'Filter/lux-filter-form',
  component: LuxFilterFormComponent,
  tags: ['autodocs'],
  args: {
    luxTitle: 'Filter',
    luxStoredFilters: storedFilters
  },
  moduleMetadata: {
    imports: [LuxInputComponent, LuxFilterItemDirective, LuxFilterFormExtendedComponent]
  }
};

export default meta;
type Story = StoryObj<LuxFilterFormComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-filter-form [luxTitle]="luxTitle" [luxStoredFilters]="luxStoredFilters">
        <lux-input luxFilterItem luxName="filter_name" luxLabel="Name" luxControlBinding="name" />
        <lux-input luxFilterItem luxName="filter_ort" luxLabel="Ort" luxControlBinding="ort" />
      </lux-filter-form>
    `
  })
};

export const AsCard: Story = {
  args: {
    luxShowAsCard: true,
    luxShowChips: false
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-filter-form
        [luxTitle]="luxTitle"
        [luxStoredFilters]="luxStoredFilters"
        [luxShowAsCard]="luxShowAsCard"
        [luxShowChips]="luxShowChips"
      >
        <lux-input luxFilterItem luxName="filter_name" luxLabel="Name" luxControlBinding="name" />
      </lux-filter-form>
    `
  })
};

export const WithExtendedOptions: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-filter-form [luxTitle]="luxTitle" [luxStoredFilters]="luxStoredFilters">
        <lux-input luxFilterItem luxName="filter_name" luxLabel="Name" luxControlBinding="name" />
        <lux-filter-form-extended>
          <lux-input luxFilterItem luxName="filter_plz" luxLabel="PLZ" luxControlBinding="plz" />
        </lux-filter-form-extended>
      </lux-filter-form>
    `
  })
};
