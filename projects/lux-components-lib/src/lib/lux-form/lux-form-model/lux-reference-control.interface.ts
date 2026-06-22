import { FormControl } from '@angular/forms';

export interface LuxReferenceControl<T = any> {
  lastValue?: T | null;
  formControl?: FormControl<T | null>;
}
