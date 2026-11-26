import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxDetailHeaderComponent } from './lux-detail-header/lux-detail-header.component';
import { LuxDetailViewComponent } from './lux-detail-view/lux-detail-view.component';
import { LuxMasterFooterComponent } from './lux-master-footer/lux-master-footer.component';
import { LuxMasterHeaderContentComponent } from './lux-master-header/lux-master-header-content.component';
import { LuxMasterListComponent } from './lux-master-list/lux-master-list.component';
import { LuxMasterDetailComponent } from './lux-master-detail.component';

const masterEntries = [
  { title: 'Eintrag 1', subtitle: 'Beschreibung des ersten Eintrags' },
  { title: 'Eintrag 2', subtitle: 'Beschreibung des zweiten Eintrags' },
  { title: 'Eintrag 3', subtitle: 'Beschreibung des dritten Eintrags' }
];

const meta: Meta<LuxMasterDetailComponent> = {
  title: 'Layout/lux-master-detail',
  component: LuxMasterDetailComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        LuxDetailHeaderComponent,
        LuxDetailViewComponent,
        LuxMasterFooterComponent,
        LuxMasterHeaderContentComponent,
        LuxMasterListComponent
      ]
    })
  ],
  args: {
    luxMasterList: masterEntries,
    luxMasterListLabel: 'Beispielliste für Master-Detail',
    luxOpen: true,
    luxMasterIsLoading: false,
    luxSelectedDetail: null
  }
};

export default meta;
type Story = StoryObj<LuxMasterDetailComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-master-detail
        class="lux-flex lux-flex-auto"
        [luxMasterList]="luxMasterList"
        [luxMasterListLabel]="luxMasterListLabel"
        [luxOpen]="luxOpen"
        [luxMasterIsLoading]="luxMasterIsLoading"
        [(luxSelectedDetail)]="luxSelectedDetail"
      >
        <lux-master-list luxTitleProp="title" luxSubTitleProp="subtitle"></lux-master-list>
        <lux-detail-view>
          <ng-template let-detail>
            <h2>{{ detail.title }}</h2>
            <p>{{ detail.subtitle }}</p>
          </ng-template>
        </lux-detail-view>
      </lux-master-detail>
    `
  })
};

export const WithHeaderAndFooter: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-master-detail
        class="lux-flex lux-flex-auto"
        [luxMasterList]="luxMasterList"
        [luxMasterListLabel]="luxMasterListLabel"
        [(luxSelectedDetail)]="luxSelectedDetail"
      >
        <lux-master-header-content>
          <p>Inhalt im Kopfbereich der Liste.</p>
        </lux-master-header-content>
        <lux-master-list luxTitleProp="title" luxSubTitleProp="subtitle"></lux-master-list>
        <lux-detail-header>
          <h2>Detailansicht</h2>
        </lux-detail-header>
        <lux-detail-view>
          <ng-template let-detail>
            <h3>{{ detail.title }}</h3>
            <p>{{ detail.subtitle }}</p>
          </ng-template>
        </lux-detail-view>
        <lux-master-footer>
          <p>Fußbereich der Liste.</p>
        </lux-master-footer>
      </lux-master-detail>
    `
  })
};

export const Loading: Story = {
  args: {
    luxMasterIsLoading: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-master-detail
        class="lux-flex lux-flex-auto"
        [luxMasterList]="luxMasterList"
        [luxMasterListLabel]="luxMasterListLabel"
        [luxMasterIsLoading]="luxMasterIsLoading"
        [(luxSelectedDetail)]="luxSelectedDetail"
      >
        <lux-master-list luxTitleProp="title" luxSubTitleProp="subtitle"></lux-master-list>
        <lux-detail-view>
          <ng-template let-detail>
            <p>{{ detail.title }}</p>
          </ng-template>
        </lux-detail-view>
      </lux-master-detail>
    `
  })
};
