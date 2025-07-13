import type { Meta, StoryObj } from '@storybook/angular';
import { LuxChipsAcComponent } from './lux-chips-ac.component';
import { ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipAuthenticExampleComponent } from '../../../../../demo-app/src/app/components-overview/chip-authentic-example/chip-authentic-example.component';
import { LuxChipAcComponent } from './lux-chips-subcomponents/lux-chip-ac.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';

type ChipsAcForStory = LuxChipsAcComponent & { chips?: { label: string; color?: string; removable?: boolean, disabled?: boolean }[] };
const meta: Meta<ChipsAcForStory> = {
  title: 'Lux Components/Form/LuxChipsAc',
  component: LuxChipsAcComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ChipAuthenticExampleComponent,
        LuxChipAcComponent
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<ChipsAcForStory>;

export const Default: Story = {
  render: (args) => {
    const { chips, ...rest } = args;
    const chipRemoved = (index: number) => {
      if (args.chips) {
        args.chips.splice(index, 1);
      }
    };
    const chipAdded = (newChip: string) => {
      if (args.chips) {
        const colors = ['primary', 'warn', 'accent'];
        const nextColor = colors[args.chips.length % colors.length];
        args.chips.push({
          label: newChip,
          color: nextColor,
        });
      }
    };
    const attributes = getAttributes(rest);
    return {
      props: {
        ...rest,
        chips,
        chipRemoved,
        chipAdded,
      },
      template: `
  <lux-chips-ac ${attributes} (luxChipAdded)="chipAdded($event)">
    @for (chip of chips; track chip; let i = $index) {
    <lux-chip-ac
      [luxColor]="chip.color"
      [luxDisabled]="chip.disabled"
      [luxRemovable]="chip.removable !== false"
      (luxChipRemoved)="chipRemoved(i)">
        {{chip.label}}
      </lux-chip-ac>
    }
  </lux-chips-ac>
`
    };
  },
  args: {
    chips: [
      { label: 'Primary Farbe', color: 'primary' },
      { label: 'Warn Farbe', color: 'warn' },
      { label: 'Option 1', color: 'accent' },
      { label: 'Nicht entfernbar', color: 'primary', removable: false },
      { label: 'Disabled Chip', color: 'primary', disabled: true },
    ],
    luxAutocompleteOptions: ['Option 1', 'Option 2', 'Option 3'],
    luxInputAllowed: true,
    luxInputLabel: 'Label',
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<lux-chip-authentic-example [chips]="chips" (luxChipRemoved)="chipRemoved($event)"></lux-chip-authentic-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
