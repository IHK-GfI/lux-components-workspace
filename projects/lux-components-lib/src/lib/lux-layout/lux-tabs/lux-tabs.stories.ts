import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTabComponent } from './lux-tabs-subcomponents/lux-tab.component';
import { LuxTabsComponent } from './lux-tabs.component';

const meta: Meta<LuxTabsComponent> = {
  title: 'Layout/lux-tabs',
  component: LuxTabsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxTabComponent] })],
  args: {
    luxActiveTab: 0,
    luxDisplayDivider: true,
    luxLazyLoading: false,
    luxShowBorder: false
  }
};

export default meta;
type Story = StoryObj<LuxTabsComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-tabs
        [(luxActiveTab)]="luxActiveTab"
        [luxDisplayDivider]="luxDisplayDivider"
        [luxLazyLoading]="luxLazyLoading"
        [luxShowBorder]="luxShowBorder"
      >
        <lux-tab luxTitle="Tab 1">
          <ng-template>
            <p>Inhalt des ersten Tabs.</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Tab 2">
          <ng-template>
            <p>Inhalt des zweiten Tabs.</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Tab 3">
          <ng-template>
            <p>Inhalt des dritten Tabs.</p>
          </ng-template>
        </lux-tab>
      </lux-tabs>
    `
  })
};

export const WithIconsAndCounter: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-tabs [(luxActiveTab)]="luxActiveTab" [luxShowBorder]="luxShowBorder">
        <lux-tab luxTitle="Posteingang" luxIconName="lux-interface-alert-information-circle" [luxCounter]="3">
          <ng-template>
            <p>Drei neue Nachrichten.</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Einstellungen" luxIconName="lux-interface-setting-tool-box">
          <ng-template>
            <p>Einstellungen des Kontos.</p>
          </ng-template>
        </lux-tab>
      </lux-tabs>
    `
  })
};

export const LazyLoadingAndDisabled: Story = {
  args: {
    luxLazyLoading: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-tabs [(luxActiveTab)]="luxActiveTab" [luxLazyLoading]="luxLazyLoading">
        <lux-tab luxTitle="Aktiv">
          <ng-template>
            <p>Dieser Tab wird erst beim Öffnen geladen.</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Deaktiviert" [luxDisabled]="true">
          <ng-template>
            <p>Dieser Tab ist nicht auswählbar.</p>
          </ng-template>
        </lux-tab>
      </lux-tabs>
    `
  })
};
