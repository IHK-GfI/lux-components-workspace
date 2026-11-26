import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTableComponent } from '../lux-table.component';
import { LuxTableColumnContentComponent } from './lux-table-column-content.component';
import { LuxTableColumnComponent } from './lux-table-column.component';

const beispielDaten = [
  { name: 'Müller', ort: 'Berlin' },
  { name: 'Schmidt', ort: 'Hamburg' },
  { name: 'Schneider', ort: 'München' }
];

const meta: Meta<LuxTableColumnContentComponent> = {
  title: 'Allgemein/lux-table-column-content',
  component: LuxTableColumnContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxTableComponent, LuxTableColumnComponent, LuxTableColumnContentComponent] })],
  render: () => ({
    props: { luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column luxColumnDef="name" luxConfigLabel="Name">
          <lux-table-column-content><ng-template let-element><span>{{ element.name }}</span></ng-template></lux-table-column-content>
        </lux-table-column>
      </lux-table>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTableColumnContentComponent>;

export const Default: Story = {};

export const MitFormatierung: Story = {
  render: () => ({
    props: { luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column luxColumnDef="ort" luxConfigLabel="Ort">
          <lux-table-column-content><ng-template let-element><strong>{{ element.ort }}</strong></ng-template></lux-table-column-content>
        </lux-table-column>
      </lux-table>
    `
  })
};
