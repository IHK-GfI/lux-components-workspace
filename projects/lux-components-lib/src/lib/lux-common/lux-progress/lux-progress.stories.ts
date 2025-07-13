import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { LuxProgressComponent } from './lux-progress.component';
import { ProgressBarExampleComponent } from '../../../../../demo/components-overview/progress-example/progress-example.component';
import { luxBgBaseColor } from '../../../../../../.storybook/common-styles-args';

const meta: Meta<LuxProgressComponent> = {
  title: 'Lux Components/Common/LuxProgress',
  component: LuxProgressComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxProgressComponent, ProgressBarExampleComponent]
    })
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: ['luxType']
    }
  }
};

export default meta;
type Story = StoryObj<LuxProgressComponent>;

export const Default: Story = {
  args: {
    luxType: 'Progressbar',
    luxMode: 'indeterminate',
    luxSize: 'medium',
  },
  argTypes: {
    ...luxBgBaseColor
  }
};

export const Demo: Story = {
  render: () => ({
    template: `<app-progress-example></app-progress-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
