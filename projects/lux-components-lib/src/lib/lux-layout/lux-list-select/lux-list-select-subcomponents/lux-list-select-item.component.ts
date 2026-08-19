import { FocusableOption } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, inject, input, output, TemplateRef, viewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxListSelectMode } from '../lux-list-select-model/lux-list-select-types';

// Kontrollen in diesem Wrapper (Checkbox/Radio) sind dauerhaft kein eigener Tab-Stopp und daher
// von der generischen Tab-Stopp-Verwaltung ausgeschlossen.
const CONTROL_CELL_SELECTOR = '.lux-list-select-control-cell';

// Für die initiale Deaktivierung (disableInnerTabStops): findet native interaktive Elemente sowie
// per luxContentTemplate projizierte [tabindex]-Elemente, die noch nicht auf -1 gesetzt wurden.
const FOCUSABLE_SELECTORS =
  'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Dieselben Elemente, aber auch nach dem Deaktivieren wiederauffindbar: generische
// [tabindex]-Elemente über den data-lux-focusable-Marker, den disableInnerTabStops() setzt.
const NAVIGABLE_SELECTORS =
  'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [data-lux-focusable]:not([disabled])';

@Component({
  selector: 'lux-list-select-item',
  templateUrl: './lux-list-select-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckbox, MatRadioButton, NgTemplateOutlet, LuxIconComponent, TranslocoPipe]
})
export class LuxListSelectItemComponent<T = unknown> implements FocusableOption {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

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
    // Steuert die Tab-Stopp-Verwaltung der inneren interaktiven Elemente: außerhalb des
    // Edit-Modus kein eigener Tab-Stopp (die Karte ist der einzige Tab-Stopp des Grids), im
    // Edit-Modus native Browser-Tab-Reihenfolge. afterRenderEffect statt effect(): muss nach dem
    // tatsächlichen Rendern der View laufen, da per luxContentTemplate projizierter
    // Consumer-Inhalt sonst noch nicht im DOM steht und von der ersten Passage nicht erfasst
    // würde. Bewusst ohne MutationObserver (Vorbild lux-list): dynamische DOM-Änderungen
    // innerhalb eines unveränderten luxContentTemplate werden dadurch nicht automatisch erfasst.
    afterRenderEffect(() => {
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
