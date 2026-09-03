import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxRenderPropertyPipe } from '../../lux-pipes/lux-render-property/lux-render-property.pipe';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormSelectableBase } from '../lux-form-model/lux-form-selectable-base.class';
import { LuxSelectFilterDirective } from '../lux-select-filter/lux-select-filter.directive';
import { LuxSelectPanelFilterComponent } from '../lux-select-filter/lux-select-panel-filter.component';
import { LuxSelectVisibleOptionCountDirective } from '../lux-select-filter/lux-select-visible-option-count.directive';

/**
 * @param O Optionstyp (z.B Land)
 * @param V Werttyp (z.B. Land, Land[], string, string[],...)
 * @param P PickValueFn-Typ (z.B. string, number,...)
 */
@Component({
  selector: 'lux-select-ac',
  templateUrl: './lux-select-ac.component.html',
  styleUrls: ['./lux-select-ac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatSelect,
    MatOption,
    NgTemplateOutlet,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective,
    LuxRenderPropertyPipe,
    LuxSelectPanelFilterComponent,
    LuxSelectFilterDirective,
    LuxSelectVisibleOptionCountDirective
  ]
})
export class LuxSelectAcComponent<O = any, V = any, P = any> extends LuxFormSelectableBase<O, V, P> {
  /**
   * Platzhalter-Text, der angezeigt wird, wenn kein Wert ausgewählt ist.
   */
  readonly luxPlaceholder = input('');

  /**
   * Aktiviert die Mehrfachauswahl (Mehrfachselektion) im Select.
   */
  readonly luxMultiple = input(false);

  /**
   * Aktiviert das Filterfeld im Auswahl-Panel.
   */
  readonly luxEnableFilter = input(false);

  /**
   * Platzhalter-Text, der im Filtereingabefeld angezeigt wird.
   */
  readonly luxFilterPlaceholder = input('Filter');

  /**
   * Vorbelegter Filterwert für das Filtereingabefeld.
   */
  readonly luxFilterValue = input('');

  /**
   * ARIA-Label für die Schaltfläche zum Löschen des Filterwertes.
   */
  readonly luxFilterClearAriaLabel = input('Clear filter');

  /**
   * Begrenzt die Anzahl der gleichzeitig sichtbaren Optionen im geöffneten Panel.
   * Werte <= 0 deaktivieren das Override und verwenden die Standardhöhe.
   */
  readonly luxVisibleOptionCount = input<number | null | undefined>(undefined);

  /**
   * Behält die ursprüngliche Reihenfolge der Optionen bei. Ist das Flag aktiv,
   * werden selektierte Optionen nicht mehr an den Anfang der Liste sortiert.
   */
  readonly luxKeepOptionOrder = input(false);

  // Potenziell eingebettetes Template für Darstellung der Labels
  readonly tempRef = contentChild(TemplateRef);
  readonly matOptions = viewChildren(MatOption);
  readonly matSelect = viewChild('select', { read: MatSelect });

  readonly displayedViewValue = signal<string | undefined>(undefined);
  readonly focused = signal(false);

  /**
   * Indizes in der Reihenfolge, wie die Optionen gerendert werden sollen.
   * Selektierte Optionen werden nach oben sortiert. Die Sortierung wird bewusst nur
   * bei Options-Änderungen und beim Öffnen des Panels aktualisiert, damit die Liste
   * während der Auswahl nicht springt.
   */
  readonly renderOptionIndexes = signal<number[]>([]);

  /**
   * Label-Extractor für Filter-Directive.
   * Wird als Arrow-Function definiert um this-Kontext zu erhalten.
   */
  filterLabelFn = (option: O, _index: number): string => {
    if (option === null || option === undefined) {
      return '';
    }

    const labelProp = this.luxOptionLabelProp();
    if (labelProp && Object.hasOwn(option, labelProp) && (option as any)[labelProp] !== undefined) {
      return '' + (option as any)[labelProp];
    }

    return '' + option;
  };

  private liveAnnouncer = inject(LiveAnnouncer);

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    return hasHint && (!this.luxHintShowOnlyOnFocus() || this.focused()) ? this.uid() + '-hint' : undefined;
  });

  constructor() {
    super();

    effect(() => {
      this.luxOptions();
      this.luxPickValue();
      this.luxKeepOptionOrder();

      untracked(() => this.refreshRenderOptionIndexes());
    });
  }

  override notifyFormValueChanged(formValue: any) {
    super.notifyFormValueChanged(formValue);

    const matOption = this.matOptions().find((option: MatOption) => option.value === formValue);
    if (matOption) {
      this.displayedViewValue.set(matOption.viewValue);
      this.liveAnnouncer.announce(matOption.viewValue, 'assertive');
    }
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  /**
   * Wird aufgerufen, wenn das Panel geöffnet/geschlossen wird.
   * Übergibt Items an die Filter-Directive und sortiert Optionen.
   */
  onOpenedChange(open: boolean, filterDirective?: LuxSelectFilterDirective) {
    if (open) {
      // Selektierte Optionen nach oben sortieren
      this.refreshRenderOptionIndexes();
      // Items an Filter-Directive übergeben
      if (filterDirective) {
        filterDirective.setItems(this.luxOptions() ?? []);
      }
    }
  }

  /**
   * Wrapper-Klick: Fokus setzen und Panel öffnen (falls erlaubt).
   * Verwendet mousedown statt click, um Event-Bubbling nicht zu stören.
   */
  onWrapperClick(event: MouseEvent) {
    if (this.luxDisabled() || this.luxReadonly()) {
      return;
    }

    // Nicht auf mat-option Elemente reagieren (diese haben ihre eigene Logik)
    const target = event.target as HTMLElement;
    if (target.closest('mat-option')) {
      return;
    }

    const matSelect = this.matSelect();

    // Fokus setzen über das zugrunde liegende MatSelect
    try {
      matSelect?.focus();
    } catch {
      // Ignorieren, falls nicht möglich
    }

    // Panel nur öffnen, wenn noch nicht offen
    if (matSelect && !matSelect.panelOpen) {
      matSelect.open();
    }
  }

  /**
   * Sortiert die Optionen: selektierte zuerst, dann rest.
   * Wird beim Öffnen des Panels aufgerufen.
   */
  private refreshRenderOptionIndexes(): void {
    const options = this.luxOptions() ?? [];

    // Bei aktivem Flag die ursprüngliche Reihenfolge beibehalten (kein Sortieren nach oben).
    if (this.luxKeepOptionOrder()) {
      this.renderOptionIndexes.set(options.map((_, i) => i));
      return;
    }

    const selectedIndexes: number[] = [];
    const unselectedIndexes: number[] = [];

    for (let i = 0; i < options.length; i++) {
      if (this.isOptionSelected(options[i], i)) {
        selectedIndexes.push(i);
      } else {
        unselectedIndexes.push(i);
      }
    }

    this.renderOptionIndexes.set([...selectedIndexes, ...unselectedIndexes]);
  }

  /**
   * Prüft, ob eine Option selektiert ist.
   */
  private isOptionSelected(option: O, index: number): boolean {
    const value = this.luxPickValue() ? this.luxOptionsPickValue()[index] : option;
    const selected = this.getValue();

    if (selected === null || selected === undefined) {
      return false;
    }

    if (Array.isArray(selected)) {
      return selected.some((s) => this.compareObjects(value as any, s as any));
    }

    return this.compareObjects(value as any, selected as any);
  }
}
