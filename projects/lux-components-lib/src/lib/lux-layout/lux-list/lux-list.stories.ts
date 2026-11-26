import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxListComponent } from './lux-list.component';
import { LuxListItemComponent } from './lux-list-subcomponents/lux-list-item.component';
import { LuxListItemContentComponent } from './lux-list-subcomponents/lux-list-item-content.component';

const meta: Meta<LuxListComponent> = {
  title: 'Layout/lux-list',
  component: LuxListComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxListItemComponent, LuxListItemContentComponent] })],
  args: {
    luxLabel: 'Liste mit Einträgen'
  }
};

export default meta;
type Story = StoryObj<LuxListComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-list [luxLabel]="luxLabel">
        <lux-list-item luxTitle="Eintrag 1" luxSubTitle="Beschreibung des ersten Eintrags" />
        <lux-list-item luxTitle="Eintrag 2" luxSubTitle="Beschreibung des zweiten Eintrags" />
        <lux-list-item luxTitle="Eintrag 3" luxSubTitle="Beschreibung des dritten Eintrags" />
      </lux-list>
    `
  })
};

export const WithSelection: Story = {
  args: {
    luxSelectedPosition: 1
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-list [luxLabel]="luxLabel" [luxSelectedPosition]="luxSelectedPosition">
        <lux-list-item luxTitle="Eintrag 1" luxSubTitle="Beschreibung des ersten Eintrags" />
        <lux-list-item luxTitle="Eintrag 2" luxSubTitle="Beschreibung des zweiten Eintrags" />
        <lux-list-item luxTitle="Eintrag 3" luxSubTitle="Beschreibung des dritten Eintrags" />
      </lux-list>
    `
  })
};

export const Empty: Story = {
  args: {
    luxEmptyLabel: 'Keine Einträge vorhanden'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-list [luxLabel]="luxLabel" [luxEmptyLabel]="luxEmptyLabel"></lux-list>
    `
  })
};
