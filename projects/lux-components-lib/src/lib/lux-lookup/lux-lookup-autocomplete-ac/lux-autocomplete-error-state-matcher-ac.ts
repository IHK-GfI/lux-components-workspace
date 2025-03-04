import { FormControl, FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { LuxLookupComponent } from '../lux-lookup-model/lux-lookup-component';
import { LuxLookupErrorStateMatcher } from '../lux-lookup-model/lux-lookup-error-state-matcher';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';

export class LuxAutocompleteErrorStateMatcherAc extends LuxLookupErrorStateMatcher {
  entries: LuxLookupTableEntry[] = [];

  constructor(lookupComponent: LuxLookupComponent<any>, entries: LuxLookupTableEntry[]) {
    super(lookupComponent);

    this.entries = entries;
  }

  override isErrorState(control: FormControl | UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (control && typeof control.value === 'string' && control.value.length > 0) {
      if (!control.errors || !control.errors['noResult']) {
        setTimeout(() => {
          control.setErrors({ noResult: true });
        });
      }
      return true;
    }

    return super.isErrorState(control, form);
  }
}
