import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxDialogActionsComponent,
  LuxDialogContentComponent,
  LuxDialogRef,
  LuxDialogStructureComponent,
  LuxDialogTitleComponent,
  LuxInputAcComponent,
  LuxValidationErrors
} from '@ihk-gfi/lux-components';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

/** Daten für den Link-Dialog. */
export interface LuxQuillLinkDialogData {
  /** Aktuelle URL (leer, wenn noch kein Link gesetzt ist). */
  url: string;
  /** true, wenn an der Cursorposition bzw. Selektion bereits ein Link existiert. */
  hasLink: boolean;
  /** true, wenn kein Text markiert ist und deshalb ein Linktext abgefragt werden muss. */
  askForText: boolean;
}

/** Ergebnis des Link-Dialogs (undefined = abgebrochen). */
export type LuxQuillLinkDialogResult = { action: 'apply'; url: string; text?: string } | { action: 'remove' } | undefined;

/** Fehler-Key der URL-Validierung. */
export const LUX_QUILL_URL_ERROR = 'luxQuillUrl';

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const ALLOWED_URL = /^(https?:\/\/[^\s/?#]+[^\s]*|mailto:[^\s]+|tel:\+?[0-9][0-9 ()/-]*)$/i;

/**
 * Ergänzt eine URL ohne Schema um "https://" (z.B. "www.ihk.de" -> "https://www.ihk.de").
 */
export function luxQuillNormalizeUrl(url: string): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed || SCHEME.test(trimmed)) {
    return trimmed;
  }
  return 'https://' + trimmed;
}

/**
 * Erlaubt http(s)-, mailto- und tel-Links. Leere Werte prüft der Required-Validator.
 */
export function luxQuillUrlValidator(control: AbstractControl): ValidationErrors | null {
  const url = luxQuillNormalizeUrl(control.value);
  if (!url) {
    return null;
  }
  return ALLOWED_URL.test(url) ? null : { [LUX_QUILL_URL_ERROR]: true };
}

@Component({
  selector: 'lux-quill-link-dialog',
  templateUrl: './lux-quill-link-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    LuxAutofocusDirective,
    LuxButtonComponent,
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxInputAcComponent
  ]
})
export class LuxQuillLinkDialogComponent implements OnInit {
  private readonly tService = inject(TranslocoService);
  protected readonly dialogRef = inject<LuxDialogRef<LuxQuillLinkDialogData>>(LuxDialogRef);
  protected data: LuxQuillLinkDialogData = { url: '', hasLink: false, askForText: false };

  protected readonly form = new FormGroup({
    url: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, luxQuillUrlValidator] }),
    text: new FormControl<string>('', { nonNullable: true })
  });

  protected readonly urlErrorCallback = (_value: unknown, errors: LuxValidationErrors) =>
    errors[LUX_QUILL_URL_ERROR] ? this.tService.translate('luxc.quill.link.url_invalid') : undefined;

  ngOnInit() {
    // Der LuxDialogService übergibt die Daten erst nach dem Erzeugen der Komponente (dialogRef.init()).
    this.data = this.dialogRef.data ?? this.data;
    this.form.controls.url.setValue(this.data.url);
    if (this.data.askForText) {
      this.form.controls.text.setValidators(Validators.required);
    }
  }

  apply() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const result: LuxQuillLinkDialogResult = { action: 'apply', url: luxQuillNormalizeUrl(this.form.controls.url.value) };
    if (this.data.askForText) {
      result.text = this.form.controls.text.value.trim();
    }
    this.dialogRef.closeDialog(result);
  }

  remove() {
    this.dialogRef.closeDialog({ action: 'remove' } satisfies LuxQuillLinkDialogResult);
  }

  cancel() {
    this.dialogRef.closeDialog(undefined);
  }
}
