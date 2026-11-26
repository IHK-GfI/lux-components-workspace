import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxListComponent } from '../lux-list.component';
import { LuxListItemComponent } from './lux-list-item.component';

const meta: Meta<LuxListItemComponent> = {
  title: 'Layout/lux-list-item',
  component: LuxListItemComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxListComponent] })],
  args: {
    luxTitle: 'Eintrag',
    luxSubTitle: 'Beschreibung des Eintrags'
  }
};

export default meta;
type Story = StoryObj<LuxListItemComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-list luxLabel="Liste mit Einträgen">
        <lux-list-item [luxTitle]="luxTitle" [luxSubTitle]="luxSubTitle" />
        <lux-list-item luxTitle="Zweiter Eintrag" luxSubTitle="Beschreibung des zweiten Eintrags" />
      </lux-list>
    `
  })
};
