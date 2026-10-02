import { FormControl, FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { LuxLookupErrorStateMatcher } from '../lux-lookup-model/lux-lookup-error-state-matcher';

export class LuxAutocompleteErrorStateMatcher extends LuxLookupErrorStateMatcher {
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
