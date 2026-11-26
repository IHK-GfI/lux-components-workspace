import type { Meta, StoryObj } from '@storybook/angular-vite';
import type { LuxSelectFilterDirective } from './lux-select-filter.directive';
import { LuxSelectPanelFilterComponent } from './lux-select-panel-filter.component';

function createFilterDirective(filterValue = ''): LuxSelectFilterDirective {
  const directive = {
    filterValue,
    onFilterInput(value: string) {
      directive.filterValue = value;
    },
    handleKeydown: () => false,
    setFilterInputRef: () => undefined
  };
  return directive as unknown as LuxSelectFilterDirective;
}

const meta: Meta<LuxSelectPanelFilterComponent> = {
  title: 'Formular/lux-select-panel-filter',
  component: LuxSelectPanelFilterComponent,
  tags: ['autodocs'],
  args: {
    filterDirective: createFilterDirective(),
    placeholder: 'Filter',
    clearAriaLabel: 'Filter leeren'
  }
};

export default meta;
type Story = StoryObj<LuxSelectPanelFilterComponent>;

export const Default: Story = {};

export const MitFilterwert: Story = {
  args: {
    filterDirective: createFilterDirective('Ber')
  }
};

export const EigenerPlatzhalter: Story = {
  args: {
    filterDirective: createFilterDirective(),
    placeholder: 'Stadt suchen'
  }
};
