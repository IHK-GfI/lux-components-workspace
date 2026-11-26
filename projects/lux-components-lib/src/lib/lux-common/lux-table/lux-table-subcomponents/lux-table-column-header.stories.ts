import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTableComponent } from '../lux-table.component';
import { LuxTableColumnHeaderComponent } from './lux-table-column-header.component';
import { LuxTableColumnComponent } from './lux-table-column.component';

const beispielDaten = [
  { name: 'Müller', ort: 'Berlin' },
  { name: 'Schmidt', ort: 'Hamburg' },
  { name: 'Schneider', ort: 'München' }
];

const meta: Meta<LuxTableColumnHeaderComponent> = {
  title: 'Allgemein/lux-table-column-header',
  component: LuxTableColumnHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxTableComponent, LuxTableColumnComponent, LuxTableColumnHeaderComponent] })],
  render: () => ({
    props: { luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column luxColumnDef="name" luxConfigLabel="Name">
          <lux-table-column-header><ng-template>Name</ng-template></lux-table-column-header>
        </lux-table-column>
      </lux-table>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTableColumnHeaderComponent>;

export const Default: Story = {};

export const MitSortierung: Story = {
  render: () => ({
    props: { luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column luxColumnDef="ort" luxConfigLabel="Ort" [luxSortable]="true">
          <lux-table-column-header><ng-template>Wohnort</ng-template></lux-table-column-header>
        </lux-table-column>
      </lux-table>
    `
  })
};
