import { JsonPipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { disabled, email, form, FormField, max, min, minLength, pattern, required } from '@angular/forms/signals';
import {
  LuxAutocompleteComponent,
  LuxAutofocusDirective,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxComponent,
  LuxChipComponent,
  LuxChipGroupComponent,
  LuxChipsComponent,
  LuxConsoleService,
  LuxDatepickerComponent,
  LuxDatetimepickerComponent,
  LuxFileInputComponent,
  LuxIconComponent,
  LuxInputComponent,
  LuxInputPrefixComponent,
  LuxInputSuffixComponent,
  LuxRadioComponent,
  LuxSelectComponent,
  LuxSliderComponent,
  LuxTextareaComponent,
  LuxTimepickerComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
import { FormBase } from '../model/form-base.class';

interface FormCommonOption {
  label: string;
  value: string;
}

interface FormCommonModel {
  user: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  };
  description: string | null;
  newsletter: boolean;
  hobbies: string[] | null;
  donation: number | null;
  hungry: boolean;
  chipsDeletable: string[] | null;
  chipsFix: string[] | null;
  radio: FormCommonOption | null;
  datepicker: string | null;
  autocomplete: string;
  comment: string | null;
}

interface FormCommonState extends FormExampleSnapshot<FormCommonModel> {
  chipItems: string[];
  chipItems2: string[];
}

@Component({
  selector: 'app-form-common',
  templateUrl: './form-common.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxDatetimepickerComponent,
    LuxFileInputComponent,
    LuxSliderComponent,
    LuxTimepickerComponent,
    LuxToggleComponent,
    LuxTextareaComponent,
    LuxSelectComponent,
    LuxRadioComponent,
    LuxInputSuffixComponent,
    LuxInputPrefixComponent,
    LuxInputComponent,
    LuxDatepickerComponent,
    LuxChipsComponent,
    LuxChipGroupComponent,
    LuxChipComponent,
    LuxCheckboxComponent,
    LuxAutocompleteComponent,
    LuxAutofocusDirective,
    FormField,
    UpperCasePipe,
    LowerCasePipe,
    JsonPipe
  ]
})
export class FormCommonComponent extends FormBase {
  hobbies: FormCommonOption[] = [
    { label: 'Reiten', value: 'r' },
    { label: 'Fußball', value: 'f' },
    { label: 'Handball', value: 'h' },
    { label: 'Stricken', value: 's' }
  ];
  chipItems: string[] = ['Chip #1', 'Chip #2'];
  chipItems2: string[] = ['Chip #3', 'Chip #4'];

  // Schalter im Beispiel "A11y - Visuell versteckte Labels"
  readonly showA11yLabels = signal(false);
  readonly pickHobbyValue = (hobby: FormCommonOption) => hobby.value;

  readonly model = signal<FormCommonModel>({
    user: { firstname: '', lastname: '', email: '', password: '' },
    description: '',
    newsletter: true,
    hobbies: null,
    donation: 0,
    hungry: true,
    chipsDeletable: [...this.chipItems],
    chipsFix: [...this.chipItems2],
    radio: this.hobbies[2],
    datepicker: new Date(2018, 11, 1).toISOString(),
    autocomplete: this.chipItems2[1],
    comment: null
  });

  readonly myForm = form(this.model, (path) => {
    pattern(path.user.firstname, /^[a-zA-Z0-9]*$/);
    required(path.user.lastname, { message: 'Bitte einen Nachnamen eingeben' });
    minLength(path.user.lastname, 3);
    required(path.user.email, { message: 'Bitte eine E-Mail-Adresse eingeben' });
    email(path.user.email);
    disabled(path.description);
    min(path.donation, 0);
    max(path.donation, 1000);
    required(path.autocomplete, { message: 'Bitte einen Wert auswählen' });
  });

  private logger = inject(LuxConsoleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    const snapshot = this.state.get<FormCommonState>('common');
    if (snapshot) {
      this.chipItems = snapshot.chipItems;
      this.chipItems2 = snapshot.chipItems2;
      this.model.set({
        ...snapshot.rawValue,
        radio: this.findHobby(snapshot.rawValue.radio)
      });
      if (snapshot.dirty) {
        this.myForm().markAsDirty();
      }
    }

    toObservable(this.model)
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.saveState());
    this.destroyRef.onDestroy(() => this.saveState());
  }

  hasUnsavedData(): boolean {
    return this.myForm().dirty();
  }

  show() {
    this.logger.log(this.model());
  }

  chipItemClicked(index: number) {
    this.logger.log(index);
    this.logger.log(this.model());
  }

  onChipItemsChange(): void {
    this.saveState();
  }

  private findHobby(hobby: FormCommonOption | null): FormCommonOption | null {
    return hobby ? (this.hobbies.find((option) => option.value === hobby.value) ?? null) : null;
  }

  private saveState(): void {
    this.state.save<FormCommonState>('common', {
      rawValue: this.model(),
      dirty: this.myForm().dirty(),
      chipItems: this.chipItems,
      chipItems2: this.chipItems2
    });
  }
}
