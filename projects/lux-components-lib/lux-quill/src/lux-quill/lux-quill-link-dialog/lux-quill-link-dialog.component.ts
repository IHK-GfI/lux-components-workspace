import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { form, FormField, required, validate } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxDialogActionsComponent,
  LuxDialogContentComponent,
  LuxDialogRef,
  LuxDialogStructureComponent,
  LuxDialogTitleComponent,
  LuxInputComponent
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

/** true, wenn die (normalisierte) URL leer oder ein erlaubter http(s)-, mailto- bzw. tel-Link ist. */
function isAllowedUrl(value: string): boolean {
  const url = luxQuillNormalizeUrl(value);
  return !url || ALLOWED_URL.test(url);
}

/**
 * Erlaubt http(s)-, mailto- und tel-Links. Leere Werte prüft der Required-Validator.
 * Validator für Reactive Forms; der Link-Dialog selbst nutzt dieselbe Prüfung in seinem Signal Form.
 */
export function luxQuillUrlValidator(control: AbstractControl): ValidationErrors | null {
  return isAllowedUrl(control.value) ? null : { [LUX_QUILL_URL_ERROR]: true };
}

@Component({
  selector: 'lux-quill-link-dialog',
  templateUrl: './lux-quill-link-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    TranslocoPipe,
    LuxAutofocusDirective,
    LuxButtonComponent,
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxInputComponent
  ]
})
export class LuxQuillLinkDialogComponent implements OnInit {
  private readonly tService = inject(TranslocoService);
  protected readonly dialogRef = inject<LuxDialogRef<LuxQuillLinkDialogData>>(LuxDialogRef);
  protected readonly data = signal<LuxQuillLinkDialogData>({ url: '', hasLink: false, askForText: false });

  protected readonly model = signal({ url: '', text: '' });
  protected readonly linkForm = form(this.model, (path) => {
    required(path.url);
    validate(path.url, ({ value }) =>
      isAllowedUrl(value()) ? undefined : { kind: LUX_QUILL_URL_ERROR, message: this.tService.translate('luxc.quill.link.url_invalid') }
    );
    required(path.text, { when: () => this.data().askForText });
  });

  ngOnInit() {
    // Der LuxDialogService übergibt die Daten erst nach dem Erzeugen der Komponente (dialogRef.init()).
    const data = this.dialogRef.data ?? this.data();
    this.data.set(data);
    this.model.update((model) => ({ ...model, url: data.url }));
  }

  apply() {
    this.linkForm.url().markAsTouched();
    this.linkForm.text().markAsTouched();
    if (this.linkForm().invalid()) {
      return;
    }

    const { url, text } = this.model();
    const result: LuxQuillLinkDialogResult = { action: 'apply', url: luxQuillNormalizeUrl(url) };
    if (this.data().askForText) {
      result.text = text.trim();
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
