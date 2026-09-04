import { JsonPipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutocompleteAcComponent,
  LuxAutofocusDirective,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxAcComponent,
  LuxChipAcComponent,
  LuxChipAcGroupComponent,
  LuxChipsAcComponent,
  LuxConsoleService,
  LuxDatepickerAcComponent,
  LuxDatetimepickerAcComponent,
  LuxFileInputAcComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxInputAcPrefixComponent,
  LuxInputAcSuffixComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxSliderAcComponent,
  LuxTextareaAcComponent,
  LuxTimepickerComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
import { FormBase } from '../model/form-base.class';

interface FormCommonOption {
  label: string;
  value: string;
}

interface FormCommonDummy {
  user: FormGroup<FormCommonUser>;
  description: FormControl<string | null>;
  newsletter: FormControl<boolean | null>;
  hobbies: FormControl<string[] | null>;
  donation: FormControl<number | null>;
  hungry: FormControl<boolean | null>;
  chipsDeletable: FormControl<string[] | null>;
  chipsFix: FormControl<string[] | null>;
  radio: FormControl<FormCommonOption | null>;
  datepicker: FormControl<string | null>;
  autocomplete: FormControl<string>;
  comment: FormControl<string | null>;
}

interface FormCommonUser {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

interface FormCommonState extends FormExampleSnapshot<ReturnType<FormGroup<FormCommonDummy>['getRawValue']>> {
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
    LuxDatetimepickerAcComponent,
    LuxFileInputAcComponent,
    LuxSliderAcComponent,
    LuxTimepickerComponent,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcComponent,
    LuxDatepickerAcComponent,
    LuxChipsAcComponent,
    LuxChipAcGroupComponent,
    LuxChipAcComponent,
    LuxCheckboxAcComponent,
    LuxAutocompleteAcComponent,
    LuxAutofocusDirective,
    ReactiveFormsModule,
    UpperCasePipe,
    LowerCasePipe,
    JsonPipe
  ]
})
export class FormCommonComponent extends FormBase implements OnInit {
  myGroup!: FormGroup<FormCommonDummy>;

  hobbies: FormCommonOption[] = [
    { label: 'Reiten', value: 'r' },
    { label: 'Fußball', value: 'f' },
    { label: 'Handball', value: 'h' },
    { label: 'Stricken', value: 's' }
  ];
  chipItems: string[] = [];
  chipItems2: string[] = [];

  // Schalter im Beispiel "A11y - Visuell versteckte Labels"
  readonly showA11yLabels = signal(false);
  readonly pickHobbyValue = (hobby: FormCommonOption) => hobby.value;

  private logger = inject(LuxConsoleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    this.chipItems = ['Chip #1', 'Chip #2'];
    this.chipItems2 = ['Chip #3', 'Chip #4'];
  }

  ngOnInit() {
    this.myGroup = new FormGroup<FormCommonDummy>({
      user: new FormGroup<FormCommonUser>({
        firstname: new FormControl<string>('', { validators: Validators.pattern('[a-zA-Z0-9]*'), nonNullable: true }),
        lastname: new FormControl<string>('', {
          validators: Validators.compose([Validators.required, Validators.minLength(3)]),
          nonNullable: true
        }),
        email: new FormControl<string>('', { validators: Validators.compose([Validators.required, Validators.email]), nonNullable: true }),
        password: new FormControl<string>('', { nonNullable: true })
      }),
      description: new FormControl<string | null>(''),
      newsletter: new FormControl<boolean | null>(true),
      hobbies: new FormControl<string[] | null>(null),
      donation: new FormControl<number | null>(0, Validators.compose([Validators.min(0), Validators.max(1000)])),
      hungry: new FormControl<boolean | null>(true),
      chipsDeletable: new FormControl<string[] | null>([...this.chipItems]),
      chipsFix: new FormControl<string[] | null>([...this.chipItems2]),
      radio: new FormControl<FormCommonOption | null>(this.hobbies[2]),
      datepicker: new FormControl<string | null>(new Date(2018, 11, 1).toISOString()),
      autocomplete: new FormControl<string>(this.chipItems2[1], { validators: Validators.required, nonNullable: true }),
      comment: new FormControl<string | null>(null)
    });
    this.myGroup.get('description')?.disable();

    const snapshot = this.state.get<FormCommonState>('common');
    if (snapshot) {
      this.chipItems = snapshot.chipItems;
      this.chipItems2 = snapshot.chipItems2;
      this.myGroup.patchValue(
        {
          ...snapshot.rawValue,
          radio: this.findHobby(snapshot.rawValue.radio)
        },
        { emitEvent: false }
      );
      if (snapshot.dirty) {
        this.myGroup.markAsDirty({ emitEvent: false });
      }
    }

    this.myGroup.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.saveState());
    this.destroyRef.onDestroy(() => this.saveState());
  }

  hasUnsavedData(): boolean {
    return this.myGroup.dirty;
  }

  show() {
    this.logger.log(this.myGroup.value);
  }

  chipItemClicked(index: number) {
    this.logger.log(index);
    this.logger.log(this.myGroup.value);
  }

  onChipItemsChange(): void {
    this.saveState();
  }

  private findHobby(hobby: FormCommonOption | null): FormCommonOption | null {
    return hobby ? (this.hobbies.find((option) => option.value === hobby.value) ?? null) : null;
  }

  private saveState(): void {
    this.state.save<FormCommonState>('common', {
      rawValue: this.myGroup.getRawValue(),
      dirty: this.myGroup.dirty,
      chipItems: this.chipItems,
      chipItems2: this.chipItems2
    });
  }
}
