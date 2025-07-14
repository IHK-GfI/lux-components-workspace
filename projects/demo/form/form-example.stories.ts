import {
  applicationConfig,
  type Meta,
  type StoryObj,
  moduleMetadata,
} from '@storybook/angular';
import {
  AfterContentInit,
  Component, contentChild, effect,
  importProvidersFrom, input
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LuxUtil } from '@ihk-gfi/lux-components';
import { TableExampleDataProviderService } from './table-example-data-provider.service';
import { FormThreeColComponent } from './form-three-col/form-three-col.component';
import { FormDualColComponent } from './form-dual-col/form-dual-col.component';
import { FormSingleColComponent } from './form-single-col/form-single-col.component';

@Component({
  selector: 'lux-story-validation-wrapper',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class StoryValidationWrapperComponent implements AfterContentInit {
  validation = input<'pristine' | 'validation'>('pristine');

  singleCol = contentChild(FormSingleColComponent);
  dualCol = contentChild(FormDualColComponent);
  threeCol = contentChild(FormThreeColComponent);

  constructor() {
    effect(() => {
      const validationValue = this.validation();
        const component = this.singleCol() || this.dualCol() || this.threeCol();
        if (component) {
          if (validationValue === 'validation') {
            LuxUtil.showValidationErrors(component.myGroup);
          } else {
            component.myGroup.reset();
          }
        }
    });
  }

  ngAfterContentInit(): void {
    const component = this.singleCol() || this.dualCol() || this.threeCol();
    if (component) {
      if (this.validation() === 'validation') {
        LuxUtil.showValidationErrors(component.myGroup);
      } else {
        component.myGroup.reset();
      }
    }
  }
}


const meta: Meta<
  FormSingleColComponent & { validation: 'pristine' | 'validation' }
> = {
  title: 'Allgemein/Mehrspaltige Formulare',
  component: FormSingleColComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserAnimationsModule),
        TableExampleDataProviderService,
      ],
    }),
    moduleMetadata({
      imports: [
        StoryValidationWrapperComponent,
        FormSingleColComponent,
        FormDualColComponent,
        FormThreeColComponent,
      ],
    }),
  ],
  argTypes: {
    validation: {
      name: 'Validation',
      options: ['pristine', 'validation'],
      control: {
        type: 'radio',
        labels: {
          pristine: 'Pristine',
          validation: 'Validation',
        },
      },
    },
  },
  args: {
    validation: 'pristine',
  },
};

export default meta;

type Story = StoryObj<
  FormSingleColComponent & { validation: 'pristine' | 'validation' }
>;

export const Einspaltig: Story = {
  render: (args) => ({
    props: {
      validation: args.validation,
    },
    template: `
      <lux-story-validation-wrapper [validation]="validation">
        <app-form-single-col></app-form-single-col>
      </lux-story-validation-wrapper>
    `,
  }),
};

export const Zweispaltig: Story = {
  render: (args) => ({
    props: {
      validation: args.validation,
    },
    template: `
      <lux-story-validation-wrapper [validation]="validation">
        <app-form-dual-col></app-form-dual-col>
      </lux-story-validation-wrapper>
    `,
  }),
};

export const Dreispaltig: Story = {
  render: (args) => ({
    props: {
      validation: args.validation,
    },
    template: `
      <lux-story-validation-wrapper [validation]="validation">
        <app-form-three-col></app-form-three-col>
      </lux-story-validation-wrapper>
    `,
  }),
};

