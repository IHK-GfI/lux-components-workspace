import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTabsComponent } from '../lux-tabs.component';
import { LuxTabComponent } from './lux-tab.component';

const meta: Meta<LuxTabComponent> = {
  title: 'Layout/lux-tab',
  component: LuxTabComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxTabsComponent] })],
  args: {
    luxTitle: 'Tab'
  }
};

export default meta;
type Story = StoryObj<LuxTabComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-tabs>
        <lux-tab luxTitle="Tab 1">
          <ng-template>
            <p>Inhalt von Tab 1</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Tab 2">
          <ng-template>
            <p>Inhalt von Tab 2</p>
          </ng-template>
        </lux-tab>
      </lux-tabs>
    `
  })
};

export const WithIconCounterAndDisabled: Story = {
  render: () => ({
    template: `
      <lux-tabs>
        <lux-tab luxTitle="Mit Icon" luxIconName="lux-interface-edit-pencil">
          <ng-template>
            <p>Tab mit Icon</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Mit Zähler" [luxCounter]="3">
          <ng-template>
            <p>Tab mit Zähler</p>
          </ng-template>
        </lux-tab>
        <lux-tab luxTitle="Deaktiviert" [luxDisabled]="true">
          <ng-template>
            <p>Dieser Tab ist deaktiviert</p>
          </ng-template>
        </lux-tab>
      </lux-tabs>
    `
  })
};
