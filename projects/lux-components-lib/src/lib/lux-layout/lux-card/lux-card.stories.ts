import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CardExampleComponent } from '../../../../../demo/components-overview/card-example/card-example.component';
import { LuxCardComponent } from './lux-card.component';
import { LuxCardContentComponent } from './lux-card-subcomponents/lux-card-content.component';
import { LuxCardActionsComponent } from './lux-card-subcomponents/lux-card-actions.component';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';

const meta: Meta<LuxCardComponent> = {
  title: 'Lux Components/Layout/LuxCard',
  component: LuxCardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxCardComponent, CardExampleComponent, LuxCardContentComponent, LuxCardActionsComponent, LuxButtonComponent],
    })
  ]
};

export default meta;
type Story = StoryObj<LuxCardComponent>;

export const Default: Story = {
  args: {
    luxTitle: 'Antrag auf Firmenkonto',
    luxSubTitle: 'Status: In Bearbeitung',
    luxExpanded: false,
    luxDisabled: false,
    luxTitleLineBreak: true
  },
  render: (args) => ({
    props: args,
    template: `
    <lux-card [luxTitle]="luxTitle" [luxSubTitle]="luxSubTitle" [luxExpanded]="luxExpanded" [luxDisabled]="luxDisabled" [luxTitleLineBreak]="luxTitleLineBreak">
      <lux-card-content>
        <h3>Unternehmensdaten</h3>
        <p><b>Firma:</b> Muster GmbH<br><b>Handelsregisternummer:</b> HRB 123456<br><b>Adresse:</b> Musterstraße 1, 12345 Musterstadt</p>
      </lux-card-content>
      <lux-card-actions>
        <lux-button luxLabel="Ablehnen" [luxRaised]="true" luxColor="warn"></lux-button>
        <lux-button luxLabel="Genehmigen" [luxRaised]="true" luxColor="primary"></lux-button>
      </lux-card-actions>
    </lux-card>`
  })
};

export const Demo: Story = {
  render: () => ({
    template: `<lux-card-example></lux-card-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
