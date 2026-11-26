import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../../lux-app-header.component';
import { LuxSideNavComponent } from '../lux-side-nav.component';
import { LuxSideNavItemComponent } from './lux-side-nav-item.component';

const meta: Meta<LuxSideNavItemComponent> = {
  title: 'Layout/lux-side-nav-item',
  component: LuxSideNavItemComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent, LuxSideNavComponent] })],
  args: {
    luxLabel: 'Menüpunkt',
    luxDisabled: false,
    luxSelected: false,
    luxCloseOnClick: true,
    luxIconName: 'lux-interface-alert-information-circle',
    luxExpandable: false
  }
};

export default meta;
type Story = StoryObj<LuxSideNavItemComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-side-nav>
          <lux-side-nav-item
            [luxLabel]="luxLabel"
            [luxDisabled]="luxDisabled"
            [luxSelected]="luxSelected"
            [luxCloseOnClick]="luxCloseOnClick"
            [luxIconName]="luxIconName" />
          <lux-side-nav-item luxLabel="Ausgewählter Punkt" [luxSelected]="true" luxIconName="lux-interface-setting-tool-box" />
        </lux-side-nav>
      </lux-app-header>
    `
  })
};

export const Expandable: Story = {
  args: {
    luxLabel: 'Bereich',
    luxExpandable: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-side-nav>
          <lux-side-nav-item [luxLabel]="luxLabel" [luxExpandable]="luxExpandable">
            <lux-side-nav-item luxLabel="Unterpunkt 1" />
            <lux-side-nav-item luxLabel="Unterpunkt 2" />
          </lux-side-nav-item>
        </lux-side-nav>
      </lux-app-header>
    `
  })
};
