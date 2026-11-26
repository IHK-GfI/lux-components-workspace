import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxMasterDetailComponent } from '../lux-master-detail.component';
import { LuxDetailViewComponent } from '../lux-detail-view/lux-detail-view.component';
import { LuxMasterListComponent } from './lux-master-list.component';

const meta: Meta<LuxMasterListComponent> = {
  title: 'Layout/lux-master-list',
  component: LuxMasterListComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxMasterDetailComponent, LuxDetailViewComponent, LuxIconComponent]
    })
  ],
  args: {
    luxTitleProp: 'title',
    luxSubTitleProp: 'subtitle'
  }
};

export default meta;
type Story = StoryObj<LuxMasterListComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      luxMasterList: [
        { title: 'Eintrag 1', subtitle: 'Beschreibung des ersten Eintrags', icon: 'lux-interface-alert-information-circle' },
        { title: 'Eintrag 2', subtitle: 'Beschreibung des zweiten Eintrags', icon: 'lux-interface-setting-tool-box' },
        { title: 'Eintrag 3', subtitle: 'Beschreibung des dritten Eintrags', icon: 'lux-interface-edit-pencil' }
      ]
    },
    template: `
      <lux-master-detail class="lux-flex lux-flex-auto" [luxMasterList]="luxMasterList" luxMasterListLabel="Beispielliste">
        <lux-master-list [luxTitleProp]="luxTitleProp" [luxSubTitleProp]="luxSubTitleProp">
          <ng-template #luxSimpleIcon let-master>
            <lux-icon [luxIconName]="master.icon" luxIconSize="1x" />
          </ng-template>
          <ng-template #luxSimpleContent let-master>
            <p>Zusätzlicher Inhalt zu {{ master.title }}</p>
          </ng-template>
        </lux-master-list>
        <lux-detail-view>
          <ng-template let-detail>
            <p>{{ detail.title }}</p>
          </ng-template>
        </lux-detail-view>
      </lux-master-detail>
    `
  })
};
