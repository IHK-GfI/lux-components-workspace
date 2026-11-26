import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxInputComponent } from '../../../lux-form/lux-input/lux-input.component';
import { LuxFilterItemDirective } from '../../lux-filter-base/lux-filter-item.directive';
import { LuxFilterFormComponent } from '../lux-filter-form.component';
import { LuxFilterFormExtendedComponent } from './lux-filter-form-extended.component';

const meta: Meta<LuxFilterFormExtendedComponent> = {
  title: 'Filter/lux-filter-form-extended',
  component: LuxFilterFormExtendedComponent,
  tags: ['autodocs'],
  moduleMetadata: {
    imports: [LuxFilterFormComponent, LuxInputComponent, LuxFilterItemDirective]
  }
};

export default meta;
type Story = StoryObj<LuxFilterFormExtendedComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-filter-form luxTitle="Filter mit erweiterten Optionen">
        <lux-input luxFilterItem luxName="filter_name" luxLabel="Name" luxControlBinding="name" />
        <lux-filter-form-extended>
          <lux-input luxFilterItem luxName="filter_plz" luxLabel="PLZ" luxControlBinding="plz" />
          <lux-input luxFilterItem luxName="filter_email" luxLabel="E-Mail" luxControlBinding="email" />
        </lux-filter-form-extended>
      </lux-filter-form>
    `
  })
};
