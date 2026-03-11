import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Injector,
  OnInit,
  effect,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { TranslocoService } from '@jsverse/transloco';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxConsoleService } from '../../lux-util/lux-console.service';

export interface LuxButtonToggleOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
  ariaLabel?: string;
}

@Component({
  selector: 'lux-button-toggle',
  templateUrl: './lux-button-toggle.component.html',
  styleUrls: ['./lux-button-toggle.component.scss'],
  host: {
    class: 'lux-flex',
    '[class.lux-dense]': 'luxDense()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonToggleGroup, MatButtonToggle, LuxIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LuxButtonToggleComponent,
      multi: true
    }
  ]
})
export class LuxButtonToggleComponent<T = unknown> implements ControlValueAccessor, OnInit {
  private static nextUniqueId = 0;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly controlContainer = inject(ControlContainer, { optional: true });
  private readonly uniqueId = LuxButtonToggleComponent.nextUniqueId++;
  private readonly tService = inject(TranslocoService);
  private readonly defaultAriaLabel = signal(this.tService.translate('luxc.button-toggle.aria_label'));

  readonly luxDense = input(false);
  readonly luxAriaLabel = input<string | undefined>(undefined);
  readonly luxOptions = input<LuxButtonToggleOption<T>[]>([]);
  readonly luxMultiple = input(false);
  readonly luxDisabled = input(false);
  readonly luxRequired = input(false);
  readonly luxHint = input<string | undefined>(undefined);
  readonly luxError = input<string | undefined>(undefined);
  readonly luxControlBinding = input<string | undefined>(undefined);
  readonly luxCompareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  readonly hintElementId = `lux-button-toggle-hint-${this.uniqueId}`;
  readonly errorElementId = `lux-button-toggle-error-${this.uniqueId}`;

  readonly luxSelected = model<T | undefined>(undefined);
  readonly luxSelectedValues = model<T[]>([]);

  private onChange: (value: T | T[] | undefined) => void = () => {};
  private onTouched: () => void = () => {};
  private writingValue = false;
  private cvaDisabled = false;
  private touched = false;
  private ngControl: NgControl | null = null;
  private ngControlResolved = false;
  private boundFormControl: FormControl<T | T[] | null> | null = null;

  constructor() {
    effect(() => {
      this.validateMinimumOptions();
    });

    effect(() => {
      this.syncSelectionToMode();
    });

    effect(() => {
      this.normalizeSingleSelectionToOption();
    });
  }

  ngOnInit(): void {
    this.tService.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.defaultAriaLabel.set(this.tService.translate('luxc.button-toggle.aria_label'));
    });

    const bindingName = this.luxControlBinding();
    if (!bindingName || this.getNgControl()) {
      return;
    }

    const control = this.controlContainer?.control?.get(bindingName);
    if (!(control instanceof FormControl)) {
      LuxConsoleService.WARN(`LuxButtonToggleComponent: Kein FormControl für luxControlBinding="${bindingName}" gefunden.`);
      return;
    }

    this.boundFormControl = control as FormControl<T | T[] | null>;
    this.writeValue(this.boundFormControl.value);
    this.cvaDisabled = this.boundFormControl.disabled;

    this.boundFormControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.writeValue(value as T | T[] | null));
    this.boundFormControl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cvaDisabled = !!this.boundFormControl?.disabled;
      this.cdr.markForCheck();
    });
    this.boundFormControl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  get hasMinimumOptions(): boolean {
    return this.luxOptions().length >= 2;
  }

  get isDisabled(): boolean {
    return this.luxDisabled() || this.cvaDisabled;
  }

  get hasError(): boolean {
    return this.isFormInvalid() || this.isRequiredMissingSelection();
  }

  get shouldShowError(): boolean {
    return this.hasError && this.isTouchedOrDirty();
  }

  get errorMessage(): string | undefined {
    if (!this.shouldShowError) {
      return undefined;
    }

    if (this.luxError()) {
      return this.luxError();
    }

    if (this.hasRequiredError()) {
      return this.tService.translate('luxc.button-toggle.error_message.required');
    }

    return undefined;
  }

  get hintMessage(): string | undefined {
    return this.shouldShowError ? undefined : this.luxHint();
  }

  get ariaLabel(): string {
    return this.luxAriaLabel() ?? this.defaultAriaLabel();
  }

  isChecked(value: T): boolean {
    return this.luxSelectedValues().some((selectedValue) => this.luxCompareWith()(selectedValue, value));
  }

  onSingleSelectionChange(event: MatButtonToggleChange): void {
    if (this.luxMultiple()) {
      return;
    }

    this.luxSelected.set(event.value != null ? (event.value as T) : undefined);
    this.emitCvaValue(true);
    this.markAsTouched();
  }

  onMultipleSelectionChange(value: T, checked: boolean): void {
    const currentValues = [...this.luxSelectedValues()];

    if (checked && !this.isChecked(value)) {
      currentValues.push(value);
    }

    if (!checked) {
      const index = currentValues.findIndex((currentValue) => this.luxCompareWith()(currentValue, value));
      if (index > -1) {
        currentValues.splice(index, 1);
      }
    }

    this.luxSelectedValues.set(currentValues);
    this.emitCvaValue(true);
    this.markAsTouched();
  }

  writeValue(value: T | T[] | null): void {
    this.writingValue = true;

    if (this.luxMultiple()) {
      if (Array.isArray(value)) {
        this.luxSelectedValues.set(value as T[]);
      } else if (value === null || value === undefined) {
        this.luxSelectedValues.set([]);
      } else {
        this.luxSelectedValues.set([value as T]);
      }
    } else {
      if (Array.isArray(value)) {
        this.luxSelected.set(value.length > 0 ? (value[0] as T) : undefined);
      } else {
        if (value === null || value === undefined) {
          this.luxSelected.set(undefined);
        } else {
          const optionValue = this.luxOptions().find((option) => this.luxCompareWith()(option.value, value as T))?.value;
          this.luxSelected.set((optionValue ?? value) as T);
        }
      }
    }

    this.writingValue = false;
  }

  registerOnChange(fn: (value: T | T[] | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled = isDisabled;
  }

  markAsTouched(): void {
    this.touched = true;
    this.boundFormControl?.markAsTouched();
    this.onTouched();
  }

  private validateMinimumOptions(): void {
    if (!this.hasMinimumOptions) {
      LuxConsoleService.WARN('LuxButtonToggleComponent benötigt mindestens 2 Optionen.');
    }
  }

  private syncSelectionToMode(): void {
    if (this.luxMultiple()) {
      const selected = this.luxSelected();
      if (this.luxSelectedValues().length === 0 && selected !== undefined) {
        this.luxSelectedValues.set([selected]);
        this.emitCvaValue();
      }
      return;
    }

    if (this.luxSelected() === undefined && this.luxSelectedValues().length > 0) {
      this.luxSelected.set(this.luxSelectedValues()[0]);
      this.emitCvaValue();
    }
  }

  private normalizeSingleSelectionToOption(): void {
    if (this.luxMultiple()) {
      return;
    }

    const selected = this.luxSelected();
    if (selected === undefined || selected === null) {
      return;
    }

    const optionValue = this.luxOptions().find((option) => this.luxCompareWith()(option.value, selected))?.value;
    if (optionValue !== undefined && optionValue !== selected) {
      this.luxSelected.set(optionValue);
      this.cdr.markForCheck();
    }
  }

  private emitCvaValue(fromUserInteraction = false): void {
    if (this.writingValue) {
      return;
    }

    const nextValue = this.luxMultiple() ? this.luxSelectedValues() : this.luxSelected();
    this.onChange(nextValue);
    this.boundFormControl?.setValue((nextValue ?? null) as T | T[] | null, { emitEvent: false });
    if (fromUserInteraction) {
      this.boundFormControl?.markAsDirty();
    }
    this.boundFormControl?.updateValueAndValidity({ emitEvent: false });
  }

  private hasSelection(): boolean {
    if (this.luxMultiple()) {
      return this.luxSelectedValues().length > 0;
    }

    return this.luxSelected() !== undefined && this.luxSelected() !== null;
  }

  private isRequiredMissingSelection(): boolean {
    return this.luxRequired() && !this.hasSelection();
  }

  private hasRequiredError(): boolean {
    const control = this.getNgControl()?.control ?? this.boundFormControl;
    return control?.hasError('required') || this.isRequiredMissingSelection();
  }

  private isFormInvalid(): boolean {
    const control = this.getNgControl()?.control ?? this.boundFormControl;
    return !!control?.invalid;
  }

  private isTouchedOrDirty(): boolean {
    const control = this.getNgControl()?.control ?? this.boundFormControl;
    if (control) {
      return control.touched || control.dirty;
    }

    return this.touched;
  }

  private getNgControl(): NgControl | null {
    if (!this.ngControlResolved) {
      this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
      this.ngControlResolved = true;
    }

    return this.ngControl;
  }
}
