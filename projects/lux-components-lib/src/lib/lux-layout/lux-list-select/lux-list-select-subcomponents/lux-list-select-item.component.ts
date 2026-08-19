import { FocusableOption } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, inject, input, output, TemplateRef, viewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxListSelectMode } from '../lux-list-select-model/lux-list-select-types';

/**
 * CSS-Klasse des Wrappers um Checkbox/Radio-Button - diese Kontrollen sind dauerhaft (auch im
 * Edit-Modus) kein eigener Tab-Stopp und werden daher von der generischen Tab-Stopp-Verwaltung
 * unten explizit ausgeschlossen.
 */
const CONTROL_CELL_SELECTOR = '.lux-list-select-control-cell';

/**
 * Interaktive Elemente, die anhand ihres Tags unabhängig vom aktuellen tabindex-Wert gefunden
 * werden (native Interaktivität) sowie generische, vom Consumer über luxContentTemplate
 * projizierte [tabindex]-Elemente, die noch nicht auf -1 gesetzt wurden. Für die initiale
 * Deaktivierung (disableInnerTabStops) - Vorbild lux-list.
 */
const FOCUSABLE_SELECTORS =
  'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dieselben Elemente, aber auch nach dem Deaktivieren (tabindex="-1") wiederauffindbar: Native
 * Elemente bleiben über ihren Tag erkennbar, generische [tabindex]-Elemente über den
 * data-lux-focusable-Marker, den disableInnerTabStops() beim ersten Deaktivieren setzt.
 */
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
  // Von der Hauptkomponente gesetzt, wenn dieses Item das im FocusKeyManager aktive UND im
  // Edit-Modus befindliche Item ist. Treibt die Tab-Stopp-Verwaltung der inneren interaktiven
  // Elemente (siehe afterRenderEffect im Konstruktor).
  readonly luxEditMode = input(false);

  readonly luxToggleSelected = output<void>();
  readonly luxDetail = output<void>();

  private readonly cardElement = viewChild.required<ElementRef<HTMLElement>>('card');

  constructor() {
    // Tab-Stopp-Verwaltung der inneren interaktiven Elemente (Detail-Button sowie ggf. über
    // luxContentTemplate projizierte Consumer-Inhalte wie Links/Buttons): Außerhalb des
    // Edit-Modus sind sie kein eigener Tab-Stopp (die Karte ist der einzige Tab-Stopp des
    // Grids), im Edit-Modus übernimmt der Browser die native Tab-Reihenfolge zwischen ihnen.
    // Läuft bei jedem luxEditMode-Wechsel sowie initial (Default false -> deckt den Erstrender
    // ab). Bewusst ohne MutationObserver (Vorbild lux-list): dynamische Änderungen INNERHALB
    // des unverändert bleibenden luxContentTemplate ohne luxEditMode-Wechsel werden dadurch
    // nicht automatisch erfasst - siehe Dokumentation im Task-Report.
    // afterRenderEffect statt effect(): läuft garantiert erst NACHDEM die View (inkl. per
    // *ngTemplateOutlet aus luxContentTemplate projiziertem Consumer-Inhalt) tatsächlich
    // gerendert ist. Ein normaler effect() lief in der Praxis zu früh - vor dem Rendern des
    // Content-Templates -, wodurch dort enthaltene interaktive Elemente von der ersten
    // disableInnerTabStops()-Passage nicht mehr erfasst wurden (leeres Query-Ergebnis).
    afterRenderEffect(() => {
      if (this.luxEditMode()) {
        this.enableInnerTabStops();
      } else {
        this.disableInnerTabStops();
      }
    });
  }

  /**
   * Native Karten-Element - wird vom FocusKeyManager der Hauptkomponente für Tab-bezogene
   * Ziel-Vergleiche (keydown.target === Karte) sowie für Containment-Prüfungen benötigt.
   */
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

  /**
   * FocusableOption-Implementierung: Der FocusKeyManager der Hauptkomponente ruft focus() bei
   * Pfeiltasten-Navigation, Home/End sowie beim (Wieder-)Fokussieren des Grid-Containers auf.
   */
  focus(): void {
    this.cardElement().nativeElement.focus();
  }

  /**
   * Prüft, ob das übergebene Element Teil dieser Karte ist (für die editMode-Fokus-Verwaltung
   * der Hauptkomponente, analog zu lux-list).
   */
  contains(element: Node | null): boolean {
    return !!element && this.elementRef.nativeElement.contains(element);
  }

  /**
   * Liefert die innerhalb der Karte per Tastatur erreichbaren Elemente (Detail-Button sowie
   * ggf. über luxContentTemplate projizierte interaktive Elemente, Checkbox/Radio-Button
   * ausgenommen) für die Tab-Zyklus-Logik des Edit-Modus.
   */
  getFocusableElements(): HTMLElement[] {
    const elements = this.cardElement().nativeElement.querySelectorAll<HTMLElement>(NAVIGABLE_SELECTORS);
    return Array.from(elements).filter((el) => !el.closest(CONTROL_CELL_SELECTOR));
  }

  /**
   * Setzt tabindex="0" auf alle inneren interaktiven Elemente (Edit-Modus betreten) und entfernt
   * den data-lux-focusable-Marker wieder, da der Browser die Tab-Reihenfolge nun selbst regelt.
   */
  private enableInnerTabStops(): void {
    this.getFocusableElements().forEach((el) => {
      el.tabIndex = 0;
      delete el.dataset['luxFocusable'];
    });
  }

  /**
   * Setzt tabindex="-1" auf alle inneren interaktiven Elemente (Edit-Modus verlassen bzw. initial).
   * Markiert generische [tabindex]-Elemente mit data-lux-focusable, damit sie auch nach dem
   * Deaktivieren über NAVIGABLE_SELECTORS wiederauffindbar bleiben.
   */
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
