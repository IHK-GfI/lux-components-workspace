import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTableComponent } from '../lux-table.component';
import { LuxTableColumnContentComponent } from './lux-table-column-content.component';
import { LuxTableColumnFooterComponent } from './lux-table-column-footer.component';
import { LuxTableColumnHeaderComponent } from './lux-table-column-header.component';
import { LuxTableColumnComponent } from './lux-table-column.component';

const beispielDaten = [
  { name: 'Müller', ort: 'Berlin' },
  { name: 'Schmidt', ort: 'Hamburg' },
  { name: 'Schneider', ort: 'München' }
];

const meta: Meta<LuxTableColumnComponent> = {
  title: 'Allgemein/lux-table-column',
  component: LuxTableColumnComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        LuxTableComponent,
        LuxTableColumnComponent,
        LuxTableColumnHeaderComponent,
        LuxTableColumnContentComponent,
        LuxTableColumnFooterComponent
      ]
    })
  ],
  args: {
    luxColumnDef: 'name',
    luxConfigLabel: 'Name',
    luxSortable: false,
    luxSticky: false,
    luxResponsiveBehaviour: '',
    luxResponsiveAt: ''
  },
  render: (args) => ({
    props: { ...args, luxData: beispielDaten },
    template: `
      <lux-table [luxData]="luxData">
        <lux-table-column
          [luxColumnDef]="luxColumnDef"
          [luxConfigLabel]="luxConfigLabel"
          [luxSortable]="luxSortable"
          [luxSticky]="luxSticky"
          [luxResponsiveBehaviour]="luxResponsiveBehaviour"
          [luxResponsiveAt]="luxResponsiveAt"
        >
          <lux-table-column-header><ng-template>{{ luxConfigLabel }}</ng-template></lux-table-column-header>
          <lux-table-column-content><ng-template let-element><span>{{ element.name }}</span></ng-template></lux-table-column-content>
          <lux-table-column-footer><ng-template>Gesamt: {{ luxData.length }}</ng-template></lux-table-column-footer>
        </lux-table-column>
      </lux-table>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTableColumnComponent>;

export const Default: Story = {};

export const Sortierbar: Story = {
  args: {
    luxSortable: true
  }
};

export const Sticky: Story = {
  args: {
    luxSticky: true
  }
};
