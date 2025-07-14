import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { LuxMasterDetailAcComponent } from './lux-master-detail-ac.component';
import { LuxMasterListAcComponent } from './lux-master-list-ac/lux-master-list-ac.component';
import { LuxDetailViewAcComponent } from './lux-detail-view-ac/lux-detail-view-ac.component';
import { LuxMasterHeaderAcComponent } from './lux-master-header-ac/lux-master-header-ac.component';
import { LuxDetailHeaderAcComponent } from './lux-detail-header-ac/lux-detail-header-ac.component';
import { LuxMasterFooterAcComponent } from './lux-master-footer-ac/lux-master-footer-ac.component';
import { LuxCardComponent } from '../lux-card/lux-card.component';
import { LuxListComponent } from '../lux-list/lux-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LuxCardContentComponent } from '../lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxMasterHeaderContentAcComponent } from './lux-master-header-ac/lux-master-header-content-ac.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { LuxFilterFormComponent } from '../../lux-filter/lux-filter-form/lux-filter-form.component';
import { LuxInputAcComponent } from '../../lux-form/lux-input-ac/lux-input-ac.component';
import { LuxTableComponent } from '../../lux-common/lux-table/lux-table.component';
import {
  LuxTableColumnHeaderComponent
} from '../../lux-common/lux-table/lux-table-subcomponents/lux-table-column-header.component';
import {
  LuxTableColumnContentComponent
} from '../../lux-common/lux-table/lux-table-subcomponents/lux-table-column-content.component';
import { LuxTableColumnComponent } from '../../lux-common/lux-table/lux-table-subcomponents/lux-table-column.component';
import {
  MasterDetailAuthenticExampleComponent
} from '../../../../../demo-app/src/app/components-overview/master-detail-authentic-example/master-detail-authentic-example.component';
import { DetailTableExampleComponent } from '../../../../../demo/components-overview/master-detail-authentic-example/detail-table-example/detail-table-example.component';

type LuxMasterDetailAcStoryArgs = LuxMasterDetailAcComponent & { masterItems?: {
    title: string;
    subtitle: string;
    icon: string;
    content: string;
    tableData: ({
      key: string;
      value: string;
      info: string;
    } | {
      key: string;
      value: number;
      info: string;
    })[];
  }[], showCustomDetailHeader?: boolean };

export default {
  title: 'Lux Components/Layout/LuxMasterDetailAc',
  component: LuxMasterDetailAcComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],

    }),
    moduleMetadata({
      imports: [
        LuxMasterDetailAcComponent,
        LuxMasterListAcComponent,
        LuxDetailViewAcComponent,
        LuxMasterHeaderAcComponent,
        LuxCardContentComponent,
        LuxDetailHeaderAcComponent,
        LuxMasterFooterAcComponent,
        LuxCardComponent,
        LuxListComponent,
        LuxMasterHeaderContentAcComponent,
        LuxIconComponent,
        LuxFilterFormComponent,
        LuxInputAcComponent,
        LuxTableComponent,
        LuxTableComponent,
        LuxTableColumnHeaderComponent,
        LuxTableColumnComponent,
        LuxTableColumnContentComponent,
        MasterDetailAuthenticExampleComponent,
        DetailTableExampleComponent
      ],
    })
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    masterItems: {
      control: 'object',
      description: 'Liste der Master-Elemente',

    },
    showCustomDetailHeader: {
      control: 'boolean',
      description: 'Optionaler Detail-Header anzeigen'
    }
  }
} as Meta<LuxMasterDetailAcStoryArgs>;

type Story = StoryObj<LuxMasterDetailAcStoryArgs>;

export const Default: Story = {
  args: {
    masterItems: [
      {
        title: 'Element 1',
        subtitle: 'Sub 1',
        icon: 'lux-info',
        content: 'Inhalt des Master-Elements 1',
        tableData: [
          { key: 'Name', value: 'Max Mustermann', info: 'Admin' },
          { key: 'Alter', value: 32, info: 'Jung' },
          { key: 'Ort', value: 'Musterstadt', info: 'Deutschland' },
          { key: 'Beruf', value: 'Entwickler', info: 'Vollzeit' },
          { key: 'Status', value: 'Aktiv', info: 'Online' },
          { key: 'E-Mail', value: 'max@mustermann.de', info: 'privat' },
          { key: 'Telefon', value: '+49 123 456789', info: 'mobil' },
          { key: 'Abteilung', value: 'IT', info: 'Backend' },
          { key: 'Eintritt', value: '2018-05-01', info: 'Langjährig' },
          { key: 'Letzter Login', value: '2025-07-10 08:15', info: 'Heute' }
        ]
      },
      {
        title: 'Element 2',
        subtitle: 'Sub 2',
        icon: 'lux-info',
        content: 'Inhalt des Master-Elements 2',
        tableData: [
          { key: 'Name', value: 'Erika Musterfrau', info: 'User' },
          { key: 'Alter', value: 28, info: 'Erfahren' },
          { key: 'Ort', value: 'Beispielstadt', info: 'Österreich' },
          { key: 'Beruf', value: 'Managerin', info: 'Teilzeit' },
          { key: 'Status', value: 'Inaktiv', info: 'Offline' },
          { key: 'E-Mail', value: 'erika@musterfrau.de', info: 'geschäftlich' },
          { key: 'Telefon', value: '+49 987 654321', info: 'festnetz' },
          { key: 'Abteilung', value: 'HR', info: 'Personal' },
          { key: 'Eintritt', value: '2020-01-15', info: 'Neu' },
          { key: 'Letzter Login', value: '2025-07-11 17:42', info: 'Gestern' }
        ]
      }
    ],
    showCustomDetailHeader: true
  },
  render: (args) => {
    const { masterItems, showCustomDetailHeader, ...restArgs } = args;
    const attributes = getAttributes(restArgs);
    return {
      props: {
        ...restArgs,
        masterIsLoading: false,
        masterSelected: null,
        masterItems,
        showCustomDetailHeader,
        attributes
      },
      template: `
<lux-master-detail-ac
  [luxMasterList]="masterItems"
  ${attributes ? attributes : ''}>
  <lux-master-header-content-ac>
       <lux-filter-form class="lux-flex-auto" [luxShowAsCard]="true" [luxShowChips]="false" [luxButtonFlat]="false">
       <lux-input-ac luxLabel="Filter" luxPlaceholder="Filter" luxType="text" luxName="filter"></lux-input-ac>
    </lux-filter-form>
  </lux-master-header-content-ac>

<lux-master-list-ac luxTitleProp="title" luxSubTitleProp="subtitle">
  <ng-template #luxSimpleIcon let-item>
    <lux-icon [luxIconName]="item?.icon"></lux-icon>
  </ng-template>
  <ng-template #luxSimpleContent let-item> {{ item?.content }} </ng-template>
</lux-master-list-ac>

  @if (showCustomDetailHeader) {
  <lux-detail-header-ac>
    <div class="lux-pl-6">
      <h2>My Custom Detail Header!</h2>
      <p>Hier ist Platz für individuellen Inhalt!</p>
    </div>
  </lux-detail-header-ac>
  }

  <lux-detail-view-ac>
    <ng-template let-detail>
      <detail-table-example [tableData]="detail.tableData"></detail-table-example>
    </ng-template>
  </lux-detail-view-ac>

  <lux-master-footer-ac>
    <div>
      <h2>Master-Footer</h2>
    </div>
  </lux-master-footer-ac>
</lux-master-detail-ac>
    `,

    }
  }
}
export const Demo: Story = {
  render: () => ({
    template: `<lux-master-detail-ac-example></lux-master-detail-ac-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
