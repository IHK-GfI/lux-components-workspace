import { Meta, StoryObj } from '@storybook/angular';
import { LuxCheckboxContainerAcComponent } from './lux-checkbox-container-ac.component';
import {
  CheckboxContainerAcExampleComponent
} from '../../../../../demo/components-overview/checkbox-container-ac-example/checkbox-container-ac-example.component';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { LuxCheckboxAcComponent } from '../../lux-form/lux-checkbox-ac/lux-checkbox-ac.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';

const meta: Meta<LuxCheckboxContainerAcComponent> = {
  title: 'Lux Components/Layout/CheckboxContainerAc',
  component: LuxCheckboxContainerAcComponent,
  decorators: [
    moduleMetadata({
      imports: [CheckboxContainerAcExampleComponent, LuxCheckboxContainerAcComponent, LuxCheckboxAcComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxCheckboxContainerAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: "Stufen"
  },

  render: (args) => {
    const attributes = getAttributes(args);
    return {
      props: args,
      template: `
        <lux-checkbox-container-ac ${attributes}>
          <lux-checkbox-ac luxLabel="Stufe 1"></lux-checkbox-ac>
          <lux-checkbox-ac luxLabel="Stufe 2"></lux-checkbox-ac>
          <lux-checkbox-ac luxLabel="Stufe 3"></lux-checkbox-ac>
        </lux-checkbox-container-ac>
      `,
    };
  }
};

export const Demo: Story = {
  render: () => ({
    template: `<checkbox-container-ac-example></checkbox-container-ac-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
