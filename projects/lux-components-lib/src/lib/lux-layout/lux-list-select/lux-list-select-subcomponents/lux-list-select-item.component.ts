import { FocusableOption } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, TemplateRef, viewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';
import { TranslocoService } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxListSelectMode } from '../lux-list-select-model/lux-list-select-types';

// Checkbox/Radio in diesem Wrapper sind dauerhaft kein eigener Tab-Stopp, daher von der generischen
// Tab-Stopp-Verwaltung ausgeschlossen.
const CONTROL_CELL_SELECTOR = '.lux-list-select-control-cell';

// Bewusst ohne :not([disabled]): auch ein deaktiviertes Element bekommt explizit tabindex="-1",
// statt sich auf den Browser-Default für <button> ohne tabindex-Attribut zu verlassen.
const FOCUSABLE_SELECTORS = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Nach dem Deaktivieren wiederauffindbar über den data-lux-focusable-Marker, den disableInnerTabStops() setzt.
const NAVIGABLE_SELECTORS =
  'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [data-lux-focusable]:not([disabled])';

@Component({
  selector: 'lux-list-select-item',
  templateUrl: './lux-list-select-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckbox, MatRadioButton, NgTemplateOutlet, LuxButtonComponent]
})
export class LuxListSelectItemComponent<T = unknown> implements FocusableOption {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private static nextItemUid = 0;
  private readonly tService = inject(TranslocoService);
  private readonly itemUid = LuxListSelectItemComponent.nextItemUid++;

  protected readonly labelId = `lux-list-select-item-label-${this.itemUid}`;
  protected readonly subLabelId = `lux-list-select-item-sublabel-${this.itemUid}`;
  // Itembezogenes Arialabel; ohne auflösbares Label bleibt die generische Ansage.
  protected readonly detailAriaLabel = computed(() => {
    const label = this.luxLabel();
    return label
      ? this.tService.translate('luxc.list-select.detail_item_arialabel', { label })
      : this.tService.translate('luxc.list-select.detail_arialabel');
  });

  readonly luxItem = input.required<T>();
  readonly luxMode = input<LuxListSelectMode>('multi');
  readonly luxSelected = input(false);
  readonly luxDisabled = input(false);
  readonly luxLabel = input('');
  readonly luxSubLabel = input<string | null>(null);
  readonly luxShowDetailButton = input(false);
  readonly luxDetailIconName = input('lux-interface-arrows-expand-5');
  readonly luxContentTemplate = input<TemplateRef<unknown> | null>(null);
  readonly luxRadioName = input('');
  // Von der Hauptkomponente gesetzt, wenn dieses Item das aktive UND im Edit-Modus befindliche
  // Item ist; treibt die Tab-Stopp-Verwaltung im afterRenderEffect unten.
  readonly luxEditMode = input(false);

  readonly luxToggleSelected = output<void>();
  readonly luxDetail = output<void>();

  private readonly cardElement = viewChild.required<ElementRef<HTMLElement>>('card');

  constructor() {
    // afterRenderEffect statt effect(): muss nach dem tatsächlichen Rendern laufen, da per
    // luxContentTemplate projizierter Inhalt sonst noch nicht im DOM steht. Bewusst ohne
    // MutationObserver: spätere DOM-Änderungen innerhalb eines unveränderten Templates werden
    // dadurch nicht automatisch erfasst.
    afterRenderEffect(() => {
      // Nur gelesen, um den Effect als Dependency zu registrieren: erscheint der Detail-Button erst
      // später, muss die Tab-Stopp-Verwaltung erneut laufen.
      this.luxShowDetailButton();
      if (this.luxEditMode()) {
        this.enableInnerTabStops();
      } else {
        this.disableInnerTabStops();
      }
    });
  }

  /** Natives Karten-Element, benötigt vom FocusKeyManager der Hauptkomponente für Ziel-Vergleiche und Containment-Prüfungen. */
  get cardElementRef(): HTMLElement {
    return this.cardElement().nativeElement;
  }

  onCardClick(event: MouseEvent) {
    if (this.luxDisabled()) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('mat-checkbox, mat-radio-button, .lux-list-select-detail')) {
      return;
    }
    this.luxToggleSelected.emit();
  }

  onControlChange() {
    if (!this.luxDisabled()) {
      this.luxToggleSelected.emit();
    }
  }

  /** FocusableOption-Implementierung: vom FocusKeyManager der Hauptkomponente bei Navigation und Grid-Fokus aufgerufen. */
  focus(): void {
    this.cardElement().nativeElement.focus();
  }

  /** Prüft, ob das übergebene Element Teil dieser Karte ist (für die editMode-Fokus-Verwaltung der Hauptkomponente). */
  contains(element: Node | null): boolean {
    return !!element && this.elementRef.nativeElement.contains(element);
  }

  /** Liefert die innerhalb der Karte per Tastatur erreichbaren Elemente (ohne Checkbox/Radio-Button) für die Tab-Zyklus-Logik des Edit-Modus. */
  getFocusableElements(): HTMLElement[] {
    const elements = this.cardElement().nativeElement.querySelectorAll<HTMLElement>(NAVIGABLE_SELECTORS);
    return Array.from(elements).filter((el) => !el.closest(CONTROL_CELL_SELECTOR));
  }

  /** Setzt tabindex="0" auf alle inneren interaktiven Elemente und entfernt den data-lux-focusable-Marker (Browser regelt die Reihenfolge nun selbst). */
  private enableInnerTabStops(): void {
    this.getFocusableElements().forEach((el) => {
      el.tabIndex = 0;
      delete el.dataset['luxFocusable'];
    });
  }

  /** Setzt tabindex="-1" auf alle inneren interaktiven Elemente und markiert generische [tabindex]-Elemente mit data-lux-focusable, damit sie über NAVIGABLE_SELECTORS wiederauffindbar bleiben. */
  private disableInnerTabStops(): void {
    const elements = this.cardElement().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    Array.from(elements)
      .filter((el) => !el.closest(CONTROL_CELL_SELECTOR))
      .forEach((el) => {
        el.dataset['luxFocusable'] = 'true';
        el.tabIndex = -1;
      });
  }
}
