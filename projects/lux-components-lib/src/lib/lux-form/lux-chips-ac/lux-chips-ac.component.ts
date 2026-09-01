import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  contentChildren,
  effect,
  input,
  output,
  signal,
  untracked,
  viewChild,
  viewChildren
} from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChip, MatChipGrid, MatChipInput, MatChipRemove, MatChipRow } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormComponentBase } from '../lux-form-model/lux-form-component-base.class';
import { LuxChipAcGroupComponent } from './lux-chips-subcomponents/lux-chip-ac-group.component';
import { LuxChipAcComponent } from './lux-chips-subcomponents/lux-chip-ac.component';

export declare type LuxChipsAcOrientation = 'horizontal' | 'vertical';
let luxChipControlUID = 0;

@Component({
  selector: 'lux-chips-ac',
  templateUrl: './lux-chips-ac.component.html',
  styleUrls: ['./lux-chips-ac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    NgClass,
    MatChipGrid,
    MatChipRow,
    NgTemplateOutlet,
    MatChipRemove,
    MatChipInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    TranslocoPipe,
    LuxTooltipDirective
  ]
})
export class LuxChipsAcComponent extends LuxFormComponentBase<string[] | null> implements AfterContentInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private readonly generatedChipUid = 'lux-chip-control-ac-' + luxChipControlUID++;
  private disabledPropagationEnabled = false;

  override readonly uid = computed(() => this.luxId() || this.generatedChipUid);

  readonly filteredOptions = signal<string[]>([]);
  readonly displayedOptions = signal<string[]>([]);

  loadingRunning = false;
  activeIndex = -1;
  onInitFinished = false;

  inputValue$: Subject<string> = new Subject<string>();
  newChip$: Subject<any> = new Subject<any>();
  canClose = false;
  actionRunning = false;

  readonly luxOrientation = input<LuxChipsAcOrientation>('horizontal');
  readonly luxInputAllowed = input(false);
  readonly luxNewChipGroup = input<LuxChipAcGroupComponent | undefined>(undefined);
  readonly luxStrict = input(false);
  readonly luxPlaceholder = input('');
  readonly luxOptionBlockSize = input(500);
  readonly luxHideBorder = input(false);
  readonly luxInputLabelAlwaysVisible = input(false);

  /**
   * Alias für luxLabel. Das Label wird bei den Chips am Eingabefeld dargestellt.
   */
  readonly luxInputLabel = input<string | undefined>(undefined);

  readonly luxAutocompleteOptions = input<string[], string[] | undefined>([], {
    transform: (options) => (options ? [...options] : [])
  });

  readonly luxChipAdded = output<string>();

  readonly luxChipComponents = contentChildren(LuxChipAcComponent);
  readonly luxChipGroupComponents = contentChildren(LuxChipAcGroupComponent);
  readonly matChips = viewChildren(MatChip);
  readonly chipRowElements = viewChildren(MatChipRow, { read: ElementRef });
  readonly chipTooltips = viewChildren(LuxTooltipDirective);

  readonly matInput = viewChild('input', { read: ElementRef });
  readonly matAutocompleteTrigger = viewChild('input', { read: MatAutocompleteTrigger });
  readonly matAutocomplete = viewChild('auto', { read: MatAutocomplete });
  readonly matAutocompleteComponent = viewChild(MatAutocomplete);
  readonly chipContainerDivRef = viewChild<ElementRef>('chipsContainerDiv');

  constructor() {
    super();

    effect(() => {
      const inputLabel = this.luxInputLabel();

      if (inputLabel !== undefined) {
        untracked(() => this.luxLabel.set(inputLabel));
      }
    });

    effect(() => {
      const disabled = this.luxDisabled();

      untracked(() => {
        // Den Disabled-State nicht während der Initialisierung übertragen, sonst würde ein an der
        // Chip-Gruppe gesetztes luxDisabled direkt wieder überschrieben.
        if (!this.disabledPropagationEnabled) {
          this.disabledPropagationEnabled = true;
          return;
        }

        setTimeout(() => {
          this.luxChipGroupComponents().forEach((chipGroup) => chipGroup.luxDisabled.set(disabled));
          this.luxChipComponents().forEach((chip) => chip.luxDisabled.set(disabled));
        });
      });
    });

    effect(() => {
      const options = this.luxAutocompleteOptions();
      untracked(() => this.setFilteredOptions(options));
    });

    effect(() => {
      this.chipRowElements();
      this.chipTooltips();

      untracked(() => this.updateChipTooltips());
    });

    effect(() => {
      this.luxChipComponents();

      untracked(() => {
        // Für den Fall ohne ChipGroup (einzelne lux-chip-ac Elemente) muss der interne
        // FormControl-Wert mit der Anzahl der Chips synchronisiert werden, damit der
        // required-Validator korrekt funktioniert.
        // Achtung: Wenn die Komponente Teil einer ReactiveForm (`inForm === true`) ist,
        // darf der Wert nicht hier überschrieben werden (das Formular ist die Quelle der Wahrheit).
        if (this.formControl && !this.luxNewChipGroup() && !this.inForm) {
          this.syncFormControlWithStandaloneChips();
        }
      });
    });

    this.subscriptions.push(
      this.newChip$.subscribe((value: string) => {
        this.add(value);
        this.setFilteredOptions(this.luxAutocompleteOptions());
      })
    );

    this.subscriptions.push(
      this.inputValue$
        .asObservable()
        .pipe(
          startWith(''),
          distinctUntilChanged(),
          map((value: string) => {
            const options = this.luxAutocompleteOptions();

            if (!value) {
              this.setFilteredOptions([...options]);
            } else {
              this.setFilteredOptions(
                options.filter((compareValue: string) => compareValue.trim().toLowerCase().indexOf(value.trim().toLowerCase()) > -1)
              );
            }
          })
        )
        .subscribe()
    );
  }

  get chipComponents(): readonly LuxChipAcComponent[] {
    return this.luxChipComponents();
  }

  get chipGroupComponents(): readonly LuxChipAcGroupComponent[] {
    return this.luxChipGroupComponents();
  }

  override ngOnInit() {
    super.ngOnInit();

    this.displayedOptions.set([]);
    this.updateDisplayedEntries();
    this.onInitFinished = true;
  }

  ngAfterContentInit() {
    const newChipGroup = this.luxNewChipGroup();

    if (this.inForm && newChipGroup) {
      if (this.formControl.value && Array.isArray(this.formControl.value)) {
        newChipGroup.luxLabels.set([...this.formControl.value]);
      } else {
        newChipGroup.luxLabels.set([]);
      }

      this.setFilteredOptions(this.luxAutocompleteOptions());
    }
  }

  ngAfterViewInit() {
    const chipContainerDivRef = this.chipContainerDivRef();
    LuxUtil.assertNonNull('chipContainerDivRef', chipContainerDivRef);

    const matAutocompleteTrigger = this.matAutocompleteTrigger();
    if (matAutocompleteTrigger && chipContainerDivRef) {
      matAutocompleteTrigger.connectedTo = { elementRef: chipContainerDivRef };
      this.cdr.detectChanges();
    }

    const matAutocompleteComponent = this.matAutocompleteComponent();
    if (matAutocompleteComponent) {
      this.subscriptions.push(
        matAutocompleteComponent._keyManager.change.subscribe((index) => {
          if (this.loadingRunning && index === -1) {
            // Workaround: Bei Änderungen an den Optionen wird der Aktivindex zurückgesetzt!
            //
            // Beim Nachladen werden die Optionen verändert und der Aktivindex
            // im KeyManager wird zurückgesetzt. D.h. der nächste Klick auf die
            // Pfeiltaste (nach unten) aktiviert nicht die nächste Option, sondern
            // die erste Option am Anfang der Liste. Aus diesem Grund wird hier
            // der letzte Aktivindex wiederhergestellt, damit der Benutzer dort
            // weitermachen kann, wo er aufgehört hat.
            //
            // Siehe: _MatAutocompleteTriggerBase._subscribeToClosingActions
            // this._resetActiveItem();
            setTimeout(() => {
              matAutocompleteComponent._keyManager.setActiveItem(this.activeIndex!);
              this.loadingRunning = false;
            });
          }
        })
      );

      this.subscriptions.push(
        matAutocompleteComponent.opened.subscribe(() => {
          setTimeout(() => {
            if (matAutocompleteComponent.panel) {
              matAutocompleteComponent.panel.nativeElement.addEventListener('scroll', this.loadOnScroll.bind(this));
            }
          });
        })
      );

      this.subscriptions.push(
        matAutocompleteComponent.closed.subscribe(() => {
          matAutocompleteComponent.panel.nativeElement.removeEventListener('scroll', this.loadOnScroll);
        })
      );
    }
  }

  /**
   * Läd den nächsten Block Daten aus den Entries nach.
   */
  updateDisplayedEntries() {
    const filteredOptions = [...this.filteredOptions()];

    if (filteredOptions.length > 0) {
      const matAutocompleteComponent = this.matAutocompleteComponent();

      if (matAutocompleteComponent) {
        this.loadingRunning = true;
        this.activeIndex = matAutocompleteComponent._keyManager.activeItemIndex ?? -1;
      }

      const start = 0;
      const end = Math.min(this.luxOptionBlockSize(), filteredOptions.length);
      const nextBlock = filteredOptions.splice(start, end);

      this.filteredOptions.set(filteredOptions);
      this.displayedOptions.update((options) => [...options, ...nextBlock]);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Liefert den Wert für "aria-labelledby" der Chips-Komponente.
   *
   * Der Wrapper (lux-form-control-wrapper) rendert das Label mit der ID "uid-label"
   * nur dann, wenn "luxIgnoreDefaultLabel" false ist. Im Template wird dieser Wert
   * mit "!luxInputAllowed && !luxInputLabelAlwaysVisible" berechnet - das ist die
   * Standardkonfiguration (kein Eingabefeld, Label nicht dauerhaft sichtbar). In
   * diesem Fall gibt es kein "<label id='uid-label'>" im DOM, obwohl die geerbte
   * labelledBy()-Implementierung bei gesetztem luxLabel dennoch auf "uid-label"
   * verweisen würde - ein toter Verweis. Deshalb wird hier in diesem Fall entweder
   * das explizit gesetzte luxAriaLabelledby zurückgegeben oder undefined, damit ein
   * gesetztes luxAriaLabel greifen kann.
   */
  override labelledBy(): string | undefined {
    const wrapperLabelSuppressed = !this.luxInputAllowed() && !this.luxInputLabelAlwaysVisible();

    if (wrapperLabelSuppressed) {
      return this.luxAriaLabelledby() || undefined;
    }

    return super.labelledBy();
  }

  /**
   * Fügt einen Chip hinzu.
   * Fügt ihn entweder der explizit mitgeteilten newChipList hinzu oder einfach
   * der letzten mitgegebenen Liste.
   * @param value
   */
  add(value: string) {
    try {
      this.actionRunning = true;

      if (value && value.trim().length > 0) {
        const newChipGroup = this.luxNewChipGroup();

        if (newChipGroup) {
          const options = this.luxAutocompleteOptions();
          const found = options && options.length > 0 ? !!options.find((option) => option === value) : true;
          const labels = newChipGroup.luxLabels();
          const foundLabel = labels ? !!labels.find((label) => label === value) : false;

          if (!this.luxStrict() || (found && !foundLabel)) {
            newChipGroup.add(value);

            const newLabels = newChipGroup.luxLabels();
            if (newLabels && Array.isArray(newLabels) && newLabels.length > 0) {
              this.formControl.setValue([...newLabels]);
            } else {
              this.formControl.setValue([]);
            }
          }
        } else {
          this.luxChipAdded.emit(value);
        }

        // Autocomplete-Feld in jedem Fall schließen (Delay über Timeout, damit kein visuelles Flackern entsteht)
        setTimeout(() => {
          this.matAutocompleteTrigger()?.closePanel();
        });
      }
    } finally {
      this.actionRunning = false;
    }
  }

  onFocusOut() {
    if (this.luxNewChipGroup()) {
      // Verzögerung nur bei luxNewChipGroup: dort wird der Wert asynchron gesetzt
      // (add/remove löst setValue erst nach dem Event aus), sodass ein direktes
      // markAsTouched kurzzeitig einen falschen required-Fehler anzeigen würde.
      setTimeout(() => {
        this.formControl.markAsTouched();
      }, 100);
    } else {
      this.formControl.markAsTouched();
    }
  }

  onChipGroupRemove(chipGroup: LuxChipAcGroupComponent, index: number) {
    try {
      this.actionRunning = true;

      chipGroup.remove(index);

      if (chipGroup === this.luxNewChipGroup()) {
        const labels = chipGroup.luxLabels();

        if (labels && Array.isArray(labels) && labels.length > 0) {
          this.formControl.setValue([...labels]);
        } else {
          this.formControl.setValue([]);
        }

        this.setFilteredOptions(this.luxAutocompleteOptions());
      }
    } finally {
      this.actionRunning = false;
    }
  }

  /**
   * Wird bei Eingabe von Werten in das Input-Feld aufgerufen und schreibt einen neuen Wert
   * in das inputValue-Subject.
   * @param value
   */
  inputChanged(value: string) {
    this.inputValue$.next(value);
  }

  /**
   * Diese Methode öffnet bei jedem Klick das Optionspanel des
   * Autocomplete-Feldes.
   *
   * Details:
   * Im Standard wird das Optionspanel eines Autocomplete-Feldes nur einmal
   * geöffnet. Ein Autocomplete-Feld prüft bei jedem Klick, ob es selbst den
   * Fokus hat und ob sein Optionspanel bereits zuvor geöffnet wurde. Wenn beide
   * Bedingungen zutreffen, bleibt das Optionspanel beim erneuten Klicken
   * standardmäßig geschlossen. Hier bei den Chips soll das Verhalten des
   * Autocomplete-Feldes geändert werden. Jeder Klick soll immer das
   * Optionspanel öffnen, unabhängig von irgendwelchen Bedingungen. Dadurch
   * können die Benutzer auch mit der Maus mehrere Chips hintereinander
   * auswählen.
   */
  onAutocompleteClick() {
    this.matAutocompleteTrigger()?.openPanel();
  }

  /**
   * Wird beim Selektieren einer Option im Autocomplete ausgeführt.
   * @param input
   * @param value
   */
  autoCompleteAdd(input: HTMLInputElement, value: string) {
    this.newChip$.next(value);
    input.value = '';
  }

  /**
   * Wird beim Input-Event des Eingabefelds ausgeführt, fragt aber vorher ab, ob das Autocomplete offen ist.
   * Wenn ja, wird kein neuer Chip erzeugt, da das Autocomplete dies übernimmt.
   * @param input
   */
  inputAdd(input: HTMLInputElement) {
    if (!this.matAutocomplete()?.isOpen) {
      const options = this.luxAutocompleteOptions();
      const displayedOptions = this.displayedOptions();

      // Falls nur eine Option übrig ist, wird diese als Wert anstelle des Inputtextes verwendet.
      if (input.value && input.value.length > 0 && options && options.length > 1 && displayedOptions && displayedOptions.length === 1) {
        this.newChip$.next(displayedOptions[0]);
        input.value = '';
      } else {
        this.newChip$.next(input.value);
        input.value = '';
      }
    }
  }

  onAutoCompleteOpened() {
    // Um einen ExpressionChangedAfterItHasBeenCheckedError im Attribute "attr.aria-expanded"
    // zu umgehen, wird hier manuell die Change Detection ausgeführt.
    this.cdr.detectChanges();

    this.canClose = false;
    setTimeout(() => {
      // Workaround: Vorschlagsliste kann erst nach kurzer Verzögerung wieder geschlossen werden.
      // Dieser Workaround ist nötig, da das Autocomplete-Panel in dem folgenden Fall sofort nach
      // dem Öffnen wieder geschlossen wird.
      //
      // Fall: Keine Chips vorhanden und der Benutzer klickt auf die Pfeil-Action.
      // In diesem Fall wird das Autocomplete-Panel durch die Material-Komponente (focusin) geöffnet
      // und durch die Pfeil-Action direkt wieder geschlossen. D.h. man kann das Autocomplete-Panel
      // nicht immer schließen, wenn es bereits geöffnet ist, weil man nicht erkennen kann, ob das
      // Autocomplete-Panel gerade erst geöffnet wurde (Panel darf nicht geschlossen werden) oder
      // bereits zu einem früheren Zeitpunkt (Panel darf geschlossen werden). Um das Problem zu
      // umgehen, wird hier ein Timeout in Verbindung mit dem canClose-Flag verwendet.
      this.canClose = true;
    }, 250);
  }

  onArrowIcon() {
    const trigger = this.matAutocompleteTrigger();

    if (trigger?.panelOpen) {
      if (this.matChips().length > 0 || this.canClose) {
        trigger.closePanel();
      }
    } else {
      trigger?.openPanel();
    }
  }

  protected override notifyFormValueChanged(formValue: any) {
    super.notifyFormValueChanged(formValue);

    const newChipGroup = this.luxNewChipGroup();

    // An dieser Stelle muss man die ValueChanged-Events ignorieren,
    // welche durch die add- und onChipGroupRemove-Methode ausgelöst
    // wurden. In diesen Fällen sind die luxLabels der ChipGroup
    // bereits aktualisiert worden. Um das doppelte Setzen zu
    // verhindern, wurde hier das actionRunning-Flag eingeführt.
    if (!this.actionRunning && this.inForm && newChipGroup) {
      if (formValue && Array.isArray(formValue)) {
        newChipGroup.luxLabels.set([...formValue]);
      } else {
        newChipGroup.luxLabels.set([]);
      }

      this.setFilteredOptions(this.luxAutocompleteOptions());
    }
  }

  /**
   * Übernimmt die neuen Optionen, filtert bereits selektierte Chips heraus und
   * setzt die dargestellte Liste zurück.
   */
  private setFilteredOptions(newOptions: string[]) {
    if (newOptions && Array.isArray(newOptions)) {
      const newChipGroup = this.luxNewChipGroup();
      const selectedChips = newChipGroup && Array.isArray(newChipGroup.luxLabels()) ? newChipGroup.luxLabels() : [];
      this.filteredOptions.set(newOptions.filter((option) => !selectedChips.includes(option)));
    } else {
      this.filteredOptions.set([]);
    }

    if (this.onInitFinished) {
      this.displayedOptions.set([]);
      this.updateDisplayedEntries();
    }
  }

  private syncFormControlWithStandaloneChips() {
    const count = this.luxChipComponents().length;
    // Bei 0 Chips setzen wir bewusst `null`, damit der FormControl-Typ
    // `FormControl<string[] | null>` die Semantik "kein Wert" repräsentiert.
    // Hinweis: Der Array-Inhalt dient hier nur als Präsenz-Indikator für den
    // required-Validator. Die tatsächlichen Chip-Labels werden ausschließlich
    // durch das Parent-Template verwaltet (deklarative lux-chip-ac-Elemente).
    const newValue: string[] | null = count > 0 ? new Array(count).fill('') : null;
    this.formControl.setValue(newValue, { emitEvent: false });
    // Hier bewusst OHNE emitEvent: false: updateValueAndValidity() muss ein StatusChangeEvent
    // über formControl.events feuern, damit die base-class-Subscription (siehe
    // LuxFormComponentBase.ngOnInit) markForCheck() aufruft. Ohne das bleibt diese OnPush-
    // Komponente nach einer rein extern (contentChildren-Query) ausgelösten Neuberechnung
    // ungeprüft, und der required-Fehler im Wrapper zeigt einen veralteten Status an - siehe
    // Issue #289. Der Aufruf feuert zwar auch ein (redundantes, wertgleiches) valueChanges-
    // Event, das ist hier aber unkritisch: notifyFormValueChanged() ist in diesem Codepfad
    // (!inForm && !luxNewChipGroup) ein No-Op.
    this.formControl.updateValueAndValidity();
  }

  private updateChipTooltips() {
    const rows = this.chipRowElements();
    const tooltips = this.chipTooltips();
    const count = Math.min(rows.length, tooltips.length);

    // Tooltip-Änderungen asynchron durchführen, um ExpressionChangedAfterItHasBeenCheckedError zu vermeiden
    Promise.resolve().then(() => {
      for (let i = 0; i < count; i++) {
        const rowElement = rows[i].nativeElement as HTMLElement;
        const text = rowElement.textContent?.trim() ?? '';
        const tooltip = tooltips[i];
        const labelElement = rowElement.querySelector<HTMLElement>('.mdc-evolution-chip__text-label, .lux-chip-label');
        const targetElement = labelElement ?? rowElement;
        const isTruncated = targetElement.scrollWidth > targetElement.clientWidth;

        tooltip.showDelay = 500;
        tooltip.message = isTruncated ? text : '';
        tooltip.disabled = !isTruncated;
      }
    });
  }

  /**
   * Stößt das Nachladen von Elementen an, wenn ein bestimmter Scrollwert erreicht wurde.
   * @param event - ScrollEvent
   */
  private loadOnScroll(event: Event) {
    const position = event.target as any;
    if (position && (position.scrollTop + position.clientHeight) / position.scrollHeight > 85 / 100) {
      this.updateDisplayedEntries();
    }
  }
}
