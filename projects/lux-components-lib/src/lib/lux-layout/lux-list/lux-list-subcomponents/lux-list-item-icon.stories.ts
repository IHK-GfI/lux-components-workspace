import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxListComponent } from '../lux-list.component';
import { LuxListItemIconComponent } from './lux-list-item-icon.component';
import { LuxListItemComponent } from './lux-list-item.component';

const meta: Meta<LuxListItemIconComponent> = {
  title: 'Layout/lux-list-item-icon',
  component: LuxListItemIconComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxListComponent, LuxListItemComponent, LuxIconComponent] })]
};

export default meta;
type Story = StoryObj<LuxListItemIconComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-list luxLabel="Liste mit Icons">
        <lux-list-item luxTitle="Eintrag mit Icon" luxSubTitle="Icon links neben dem Titel">
          <lux-list-item-icon>
            <lux-icon luxIconName="lux-interface-edit-pencil" luxIconSize="1x" />
          </lux-list-item-icon>
        </lux-list-item>
      </lux-list>
    `
  })
};
