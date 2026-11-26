import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxListComponent } from '../lux-list.component';
import { LuxListItemContentComponent } from './lux-list-item-content.component';
import { LuxListItemIconComponent } from './lux-list-item-icon.component';
import { LuxListItemComponent } from './lux-list-item.component';

const meta: Meta<LuxListItemContentComponent> = {
  title: 'Layout/lux-list-item-content',
  component: LuxListItemContentComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxListComponent, LuxListItemComponent, LuxListItemIconComponent, LuxIconComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxListItemContentComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-list luxLabel="Liste mit Einträgen">
        <lux-list-item luxTitle="Eintrag mit Inhalt">
          <lux-list-item-icon>
            <lux-icon luxIconName="lux-interface-alert-information-circle" luxIconSize="1x" />
          </lux-list-item-icon>
          <lux-list-item-content>
            <p>Zusätzlicher Inhalt innerhalb des Listeneintrags.</p>
          </lux-list-item-content>
        </lux-list-item>
      </lux-list>
    `
  })
};
