import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFormControlWrapperComponent, LuxFormControlWrapperHost } from './lux-form-control-wrapper.component';

function createHost(
  overrides: Partial<{
    luxLabel: string;
    luxHint: string;
    errorMessage: string;
    required: boolean;
    disabled: boolean;
    showError: boolean;
    dense: boolean;
  }> = {}
): LuxFormControlWrapperHost {
  return {
    uid: signal('lux-form-control-wrapper-story'),
    luxLabel: signal(overrides.luxLabel ?? 'Name'),
    luxHint: signal(overrides.luxHint ?? 'Bitte gib deinen vollständigen Namen ein.'),
    luxHintShowOnlyOnFocus: signal(false),
    luxDense: signal(overrides.dense ?? false),
    errorMessage: signal(overrides.errorMessage),
    formLabelComponent: signal(undefined),
    formHintComponent: signal(undefined),
    wrapperState: signal({
      disabled: overrides.disabled ?? false,
      readonly: false,
      required: overrides.required ?? false,
      showError: overrides.showError ?? false
    }),
    dismissError: () => undefined
  } as unknown as LuxFormControlWrapperHost;
}

const meta: Meta<LuxFormControlWrapperComponent> = {
  title: 'Formular/lux-form-control-wrapper',
  component: LuxFormControlWrapperComponent,
  tags: ['autodocs'],
  args: {
    luxFormComponent: createHost()
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-form-control-wrapper [luxFormComponent]="luxFormComponent">
        <input aria-label="Name" />
      </lux-form-control-wrapper>
    `
  })
};

export default meta;
type Story = StoryObj<LuxFormControlWrapperComponent>;

export const Default: Story = {};

export const Pflichtfeld: Story = {
  args: {
    luxFormComponent: createHost({ required: true })
  }
};

export const MitFehler: Story = {
  args: {
    luxFormComponent: createHost({ required: true, showError: true, errorMessage: 'Bitte fülle dieses Feld aus.' })
  }
};

export const Deaktiviert: Story = {
  args: {
    luxFormComponent: createHost({ disabled: true })
  }
};
