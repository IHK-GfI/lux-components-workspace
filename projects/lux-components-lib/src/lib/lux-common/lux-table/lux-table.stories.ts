import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTableColumnContentComponent } from './lux-table-subcomponents/lux-table-column-content.component';
import { LuxTableColumnFooterComponent } from './lux-table-subcomponents/lux-table-column-footer.component';
import { LuxTableColumnHeaderComponent } from './lux-table-subcomponents/lux-table-column-header.component';
import { LuxTableColumnComponent } from './lux-table-subcomponents/lux-table-column.component';
import { LuxTableComponent } from './lux-table.component';

const beispielDaten = [
  { name: 'Müller', vorname: 'Anna', ort: 'Berlin' },
  { name: 'Schmidt', vorname: 'Ben', ort: 'Hamburg' },
  { name: 'Schneider', vorname: 'Clara', ort: 'München' },
  { name: 'Fischer', vorname: 'David', ort: 'Köln' },
  { name: 'Weber', vorname: 'Emma', ort: 'Frankfurt' },
  { name: 'Meyer', vorname: 'Felix', ort: 'Stuttgart' },
  { name: 'Wagner', vorname: 'Greta', ort: 'Düsseldorf' },
  { name: 'Becker', vorname: 'Hans', ort: 'Leipzig' },
  { name: 'Schulz', vorname: 'Ida', ort: 'Dresden' },
  { name: 'Hoffmann', vorname: 'Jan', ort: 'Hannover' },
  { name: 'Koch', vorname: 'Lena', ort: 'Bremen' },
  { name: 'Richter', vorname: 'Max', ort: 'Nürnberg' }
];

const spalten = `
  <lux-table-column luxColumnDef="name" luxConfigLabel="Name" [luxSortable]="true">
    <lux-table-column-header><ng-template>Name</ng-template></lux-table-column-header>
    <lux-table-column-content><ng-template let-element><span>{{ element.name }}</span></ng-template></lux-table-column-content>
    <lux-table-column-footer><ng-template>Anzahl: {{ luxData.length }}</ng-template></lux-table-column-footer>
  </lux-table-column>
  <lux-table-column luxColumnDef="vorname" luxConfigLabel="Vorname" [luxSortable]="true">
    <lux-table-column-header><ng-template>Vorname</ng-template></lux-table-column-header>
    <lux-table-column-content><ng-template let-element><span>{{ element.vorname }}</span></ng-template></lux-table-column-content>
  </lux-table-column>
  <lux-table-column luxColumnDef="ort" luxConfigLabel="Ort">
    <lux-table-column-header><ng-template>Ort</ng-template></lux-table-column-header>
    <lux-table-column-content><ng-template let-element><span>{{ element.ort }}</span></ng-template></lux-table-column-content>
  </lux-table-column>
`;

const meta: Meta<LuxTableComponent> = {
  title: 'Allgemein/lux-table',
  component: LuxTableComponent,
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
    luxData: beispielDaten,
    luxShowFilter: false,
    luxFilterText: 'Filter',
    luxNoDataText: 'Keine Daten gefunden.',
    luxPageSize: 5,
    luxMultiSelect: false
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-table
        [luxData]="luxData"
        [luxShowFilter]="luxShowFilter"
        [luxFilterText]="luxFilterText"
        [luxNoDataText]="luxNoDataText"
        [luxPageSize]="luxPageSize"
        [luxMultiSelect]="luxMultiSelect"
      >
        ${spalten}
      </lux-table>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTableComponent>;

export const Default: Story = {};

export const MitFilter: Story = {
  args: {
    luxShowFilter: true
  }
};

export const MehrfachAuswahl: Story = {
  args: {
    luxMultiSelect: true
  }
};

export const OhneDaten: Story = {
  args: {
    luxData: []
  }
};
