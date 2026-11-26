import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxBreadcrumbComponent } from './lux-breadcrumb.component';

const meta: Meta<LuxBreadcrumbComponent> = {
  title: 'Navigation/lux-breadcrumb',
  component: LuxBreadcrumbComponent,
  tags: ['autodocs'],
  args: {
    luxEntries: [{ name: 'Startseite', url: '/home' }, { name: 'Kunden', url: '/kunden' }, { name: 'Kundendetails' }]
  }
};

export default meta;
type Story = StoryObj<LuxBreadcrumbComponent>;

export const Default: Story = {};

export const Wrap: Story = {
  args: {
    luxWrap: true,
    luxEntries: [
      { name: 'Startseite', url: '/home' },
      { name: 'Verwaltung', url: '/verwaltung' },
      { name: 'Benutzerverwaltung', url: '/verwaltung/benutzer' },
      { name: 'Rollen', url: '/verwaltung/benutzer/rollen' },
      { name: 'Rollendetails', url: '/verwaltung/benutzer/rollen/details' },
      { name: 'Berechtigungen' }
    ]
  }
};

export const ShowOnlyFirstAndLast: Story = {
  args: {
    luxShowOnlyFirstAndLast: true,
    luxEntries: [
      { name: 'Startseite', url: '/home' },
      { name: 'Verwaltung', url: '/verwaltung' },
      { name: 'Benutzerverwaltung', url: '/verwaltung/benutzer' },
      { name: 'Rollen', url: '/verwaltung/benutzer/rollen' },
      { name: 'Rollendetails' }
    ]
  }
};
