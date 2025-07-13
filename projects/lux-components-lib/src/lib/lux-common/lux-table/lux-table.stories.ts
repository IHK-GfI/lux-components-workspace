import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LuxTableComponent } from './lux-table.component';
import { TableExampleComponent } from '../../../../../demo-app/src/app/components-overview/table-example/table-example.component';
import { LuxTableColumnComponent } from './lux-table-subcomponents/lux-table-column.component';
import { LuxTableColumnHeaderComponent } from './lux-table-subcomponents/lux-table-column-header.component';
import { LuxTableColumnContentComponent } from './lux-table-subcomponents/lux-table-column-content.component';
import {
  getAttributes,
} from '../../../../../../.storybook/storybook-utils';

const meta: Meta<LuxTableComponent> = {
  title: 'Lux Components/Common/LuxTable',
  component: LuxTableComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<LuxTableComponent>;

export const Default: Story = {
  render: (args) => {
    const attributes = getAttributes(args);
    return {
      props: args,
      template: `
        <lux-table ${attributes}>
          <lux-table-column luxColumnDef="position">
            <lux-table-column-header>
              <ng-template>ID</ng-template>
            </lux-table-column-header>
            <lux-table-column-content>
              <ng-template let-element>{{element.position}}</ng-template>
            </lux-table-column-content>
          </lux-table-column>

          <lux-table-column luxColumnDef="name">
            <lux-table-column-header>
              <ng-template>Name</ng-template>
            </lux-table-column-header>
            <lux-table-column-content>
              <ng-template let-element>{{element.name}}</ng-template>
            </lux-table-column-content>
          </lux-table-column>

          <lux-table-column luxColumnDef="weight">
            <lux-table-column-header>
              <ng-template>Weight</ng-template>
            </lux-table-column-header>
            <lux-table-column-content>
              <ng-template let-element>{{element.weight}}</ng-template>
            </lux-table-column-content>
          </lux-table-column>

          <lux-table-column luxColumnDef="symbol">
            <lux-table-column-header>
              <ng-template>Symbol</ng-template>
            </lux-table-column-header>
            <lux-table-column-content>
              <ng-template let-element>{{element.symbol}}</ng-template>
            </lux-table-column-content>
          </lux-table-column>
        </lux-table>
    `,
      moduleMetadata: {
        imports: [
          LuxTableComponent,
          LuxTableColumnComponent,
          LuxTableColumnHeaderComponent,
          LuxTableColumnContentComponent,
        ],
      },
    };
  },
  args: {
    luxData: [
      { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
      { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
      { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
      { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    ],

    luxAlignElementsTop: false,
    luxAutoPaginate: false,
    luxShowFilter: true,
    luxShowPagination: true,
    luxPageSize: 3
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<app-table-example></app-table-example>`,
  }),
  decorators: [
    moduleMetadata({
      imports: [
        TableExampleComponent,
  ],
    }),
  ],
  parameters: {
    controls: {
      disable: true,
    },
  },

};
