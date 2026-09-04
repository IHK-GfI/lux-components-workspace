import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';
import { LuxAutocompleteComponent } from '../../lux-form/lux-autocomplete/lux-autocomplete.component';
import { LuxChipsComponent } from '../../lux-form/lux-chips/lux-chips.component';
import { LuxLookupAutocompleteComponent } from '../../lux-lookup/lux-lookup-autocomplete/lux-lookup-autocomplete.component';

@Directive({
  selector: '[luxAutofocus]'
})
export class LuxAutofocusDirective implements AfterViewInit {
  private elementRef = inject(ElementRef);

  readonly luxAutofocusSelector = input<string>();
  readonly luxAutofocusComponent = input<any>();

  private getEffectiveSelector(): string | undefined {
    if (this.luxAutofocusSelector()) {
      return this.luxAutofocusSelector();
    }

    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();

    if (
      tagName === 'lux-input-ac' ||
      tagName === 'lux-input' ||
      tagName === 'lux-autocomplete-ac' ||
      tagName === 'lux-autocomplete' ||
      tagName === 'lux-lookup-autocomplete-ac' ||
      tagName === 'lux-lookup-autocomplete' ||
      tagName === 'lux-checkbox-ac' ||
      tagName === 'lux-checkbox' ||
      tagName === 'lux-chips-ac' ||
      tagName === 'lux-chips' ||
      tagName === 'lux-timepicker' ||
      tagName === 'lux-datepicker-ac' ||
      tagName === 'lux-datepicker' ||
      tagName === 'lux-datetimepicker-ac' ||
      tagName === 'lux-datetimepicker' ||
      tagName === 'lux-file-input-ac' ||
      tagName === 'lux-file-input' ||
      tagName === 'lux-radio-ac' ||
      tagName === 'lux-radio' ||
      tagName === 'lux-slider-ac' ||
      tagName === 'lux-slider'
    ) {
      return 'input:not([disabled])';
    } else if (
      tagName === 'lux-select-ac' ||
      tagName === 'lux-select' ||
      tagName === 'lux-lookup-combobox-ac' ||
      tagName === 'lux-lookup-combobox'
    ) {
      return 'mat-select';
    } else if (
      tagName === 'lux-button' ||
      tagName === 'lux-link' ||
      tagName === 'lux-link-plain' ||
      tagName === 'lux-toggle-ac' ||
      tagName === 'lux-toggle'
    ) {
      return 'button:not([disabled])';
    } else if (tagName === 'lux-file-list') {
      return 'lux-card.lux-file-list';
    } else if (tagName === 'lux-file-upload') {
      return 'div.lux-file-upload-drop-container';
    } else if (tagName === 'lux-textarea-ac' || tagName === 'lux-textarea') {
      return 'textarea:not([disabled])';
    } else if (tagName == 'lux-tile' || tagName == 'lux-tile-ac') {
      return 'mat-card';
    } else if (tagName == 'lux-breadcrumb') {
      return 'lux-breadcrumb a';
    }

    return undefined;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Hier wird bewusst die focus()-Methode des nativen Elements aufgerufen, da das autofokus-Attribut
      // nicht funktioniert, wenn die Seite nicht komplett neu geladen wird. Das Fokussieren soll
      // jedes Mal funktionerien, wenn die Komponente erzeugt wird.
      const selector = this.getEffectiveSelector();
      if (selector) {
        const el = this.elementRef.nativeElement.querySelector(selector);
        if (el) {
          el.focus({ focusVisible: false });
        }
      } else {
        this.elementRef.nativeElement.focus({ focusVisible: false });
      }
    });

    setTimeout(() => {
      // Workaround für Autocomplete-Elemente
      // Wenn das Element ein Autocomplete ist, wird das Panel geschlossen,
      // da es sonst geöffnet wird, wenn das Element fokussiert wird.
      const autofocusComponent = this.luxAutofocusComponent();
      if (autofocusComponent instanceof LuxAutocompleteComponent) {
        autofocusComponent.matAutoComplete()?.closePanel();
      } else if (autofocusComponent instanceof LuxLookupAutocompleteComponent) {
        autofocusComponent.matAutocompleteTrigger()?.closePanel();
      } else if (autofocusComponent instanceof LuxChipsComponent) {
        autofocusComponent.matAutocompleteTrigger()?.closePanel();
      }
    });
  }
}
