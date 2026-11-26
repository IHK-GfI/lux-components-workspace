import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxListComponent } from '../lux-list.component';
import { LuxListItemCustomHeaderComponent } from './lux-list-item-custom-header.component';
import { LuxListItemComponent } from './lux-list-item.component';

const meta: Meta<LuxListItemCustomHeaderComponent> = {
  title: 'Layout/lux-list-item-custom-header',
  component: LuxListItemCustomHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxListComponent, LuxListItemComponent] })]
};

export default meta;
type Story = StoryObj<LuxListItemCustomHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-list luxLabel="Liste mit individuellem Kopfbereich">
        <lux-list-item>
          <lux-list-item-custom-header>
            <strong>Individueller Titel</strong>
            <span>Individueller Untertitel</span>
          </lux-list-item-custom-header>
        </lux-list-item>
      </lux-list>
    `
  })
};
