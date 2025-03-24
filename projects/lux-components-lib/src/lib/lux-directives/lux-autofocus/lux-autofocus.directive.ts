import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';
import { LuxAutocompleteAcComponent } from '../../lux-form/lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxChipsAcComponent } from '../../lux-form/lux-chips-ac/lux-chips-ac.component';
import { LuxLookupAutocompleteAcComponent } from '../../lux-lookup/lux-lookup-autocomplete-ac/lux-lookup-autocomplete-ac.component';

@Directive({
  selector: '[luxAutofocus]'
})
export class LuxAutofocusDirective implements AfterViewInit {
  private elementRef = inject(ElementRef);

  @Input() luxAutofocusSelector?: string;
  @Input() luxAutofocusComponent?: any;

  constructor() {
    if (!this.luxAutofocusSelector) {
      const tagName = this.elementRef.nativeElement.tagName.toLowerCase();

      if (
        tagName === 'lux-input-ac' ||
        tagName === 'lux-autocomplete-ac' ||
        tagName === 'lux-lookup-autocomplete-ac' ||
        tagName === 'lux-checkbox-ac' ||
        tagName === 'lux-chips-ac' ||
        tagName === 'lux-datepicker-ac' ||
        tagName === 'lux-datetimepicker-ac' ||
        tagName === 'lux-file-input-ac' ||
        tagName === 'lux-radio-ac' ||
        tagName === 'lux-slider-ac'
      ) {
        this.luxAutofocusSelector = 'input:not([disabled])';
      } else if (tagName === 'lux-select-ac' || tagName === 'lux-lookup-combobox-ac') {
        this.luxAutofocusSelector = 'mat-select';
      } else if (tagName === 'lux-button' || tagName === 'lux-link' || tagName === 'lux-link-plain' || tagName === 'lux-toggle-ac') {
        this.luxAutofocusSelector = 'button:not([disabled])';
      } else if (tagName === 'lux-file-list') {
        this.luxAutofocusSelector = 'lux-card.lux-file-list';
      } else if (tagName === 'lux-file-upload') {
        this.luxAutofocusSelector = 'div.lux-file-upload-drop-container';
      } else if (tagName === 'lux-textarea-ac') {
        this.luxAutofocusSelector = 'textarea:not([disabled])';
      } else if (tagName == 'lux-tile' || tagName == 'lux-tile-ac') {
        this.luxAutofocusSelector = 'mat-card';
      } else if (tagName == 'lux-breadcrumb') {
        this.luxAutofocusSelector = 'lux-breadcrumb a';
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Hier wird bewusst die focus()-Methode des nativen Elements aufgerufen, da das autofokus-Attribut
      // nicht funktioniert, wenn die Seite nicht komplett neu geladen wird. Das Fokussieren soll
      // jedes Mal funktionerien, wenn die Komponente erzeugt wird.
      if (this.luxAutofocusSelector) {
        const el = this.elementRef.nativeElement.querySelector(this.luxAutofocusSelector);
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
      if (this.luxAutofocusComponent instanceof LuxAutocompleteAcComponent) {
        this.luxAutofocusComponent.matAutoComplete.closePanel();
      } else if (this.luxAutofocusComponent instanceof LuxLookupAutocompleteAcComponent) {
        this.luxAutofocusComponent.matAutocompleteTrigger?.closePanel();
      } else if (this.luxAutofocusComponent instanceof LuxChipsAcComponent) {
        this.luxAutofocusComponent.matAutocompleteTrigger?.closePanel();
      }
    });
  }
}
