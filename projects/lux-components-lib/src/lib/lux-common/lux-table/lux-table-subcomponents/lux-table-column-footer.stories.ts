import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTableComponent } from '../lux-table.component';
import { LuxTableColumnComponent } from './lux-table-column.component';
import { LuxTableColumnFooterComponent } from './lux-table-column-footer.component';

const beispielDaten = [
  { name: 'Müller', ort: 'Berlin' },
  { name: 'Schmidt', ort: 'Hamburg' },
  { name: 'Schneider', ort: 'München' }
];

const meta: Meta<LuxTableColumnFooterComponent> = {
  title: 'Allgemein/lux-table-column-footer',
  component: LuxTableColumnFooterComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxTableComponent, LuxTableColumnComponent, LuxTableColumnFooterComponent] })],
  render: () => ({
    props: { luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column luxColumnDef="name" luxConfigLabel="Name">
          <lux-table-column-footer><ng-template>Gesamt: {{ luxData.length }}</ng-template></lux-table-column-footer>
        </lux-table-column>
      </lux-table>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTableColumnFooterComponent>;

export const Default: Story = {};

export const MitText: Story = {
  render: () => ({
    props: { luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column luxColumnDef="ort" luxConfigLabel="Ort">
          <lux-table-column-footer><ng-template>Summe der Orte</ng-template></lux-table-column-footer>
        </lux-table-column>
      </lux-table>
    `
  })
};
