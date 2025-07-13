import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { LuxProgressComponent } from './lux-progress.component';
import {
  SpinnerExampleComponent
} from '../../../../../demo/components-overview/spinner-example/spinner-example.component';
import { luxBgBaseColor } from '../../../../../../.storybook/common-styles-args';

const meta: Meta<LuxProgressComponent> = {
  title: 'Lux Components/Common/LuxSpinner',
  component: LuxProgressComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxProgressComponent, SpinnerExampleComponent]
    })
  ],
};

export default meta;
type Story = StoryObj<LuxProgressComponent>;

export const Default: Story = {
  args: {
    luxType: 'Spinner',
    luxMode: 'indeterminate',
  },
  argTypes: {
    ...luxBgBaseColor
  }
};

export const Demo: Story = {
  render: () => ({
    template: `<app-spinner-example></app-spinner-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

