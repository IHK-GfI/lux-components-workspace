import {
  afterNextRender,
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DoCheck,
  effect,
  ElementRef,
  inject,
  input,
  model,
  NgZone,
  output,
  Renderer2,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl, ValidationErrors, Validators } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import {
  LuxConsoleService,
  LuxDialogService,
  LuxErrorCallbackFnType,
  LuxIconComponent,
  LuxTagIdDirective,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import Quill, { Range } from 'quill/core';
import Link from 'quill/formats/link';
import { take } from 'rxjs/operators';
import { LUX_QUILL_CONFIG, LuxQuillConfig, LuxQuillPreset, luxQuillResolveConfig } from './lux-quill-config';
import {
  luxQuillFormats,
  luxQuillHeadingAttributes,
  luxQuillHeadingMatcher,
  luxQuillNormalizeHtml,
  luxQuillRegisterFormats
} from './lux-quill-formats';
import { LUX_QUILL_RELEASE_KEYS, luxQuillKeyboardBindings, LuxQuillKeyboardState } from './lux-quill-keyboard';
import { LuxQuillLinkDialogComponent, LuxQuillLinkDialogData, LuxQuillLinkDialogResult } from './lux-quill-link-dialog/lux-quill-link-dialog.component';
import { LuxQuillToolbarAction, LuxQuillToolbarComponent } from './lux-quill-toolbar/lux-quill-toolbar.component';

/**
 * Rich-Text-Editor auf Basis von Quill.js.
 *
 * Der Wert ist ein HTML-String (leerer Editor = ''). Die Komponente funktioniert ohne Formular
 * über [(value)] sowie in Reactive Forms bzw. mit ngModel (ControlValueAccessor).
 */
@Component({
  selector: 'lux-quill',
  templateUrl: './lux-quill.component.html',
  styleUrl: './lux-quill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxQuillToolbarComponent, LuxIconComponent, LuxTagIdDirective, MatError, MatHint, TranslocoPipe],
  host: {
    class: 'lux-quill lux-form-control-wrapper-host',
    '[class.lux-form-control-readonly]': 'isReadonly()'
  }
})
export class LuxQuillComponent implements ControlValueAccessor, AfterContentInit, DoCheck {
  private static nextId = 0;

  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tService = inject(TranslocoService);
  private readonly dialogService = inject(LuxDialogService);
  private readonly logger = inject(LuxConsoleService);
  private readonly globalConfig = inject(LUX_QUILL_CONFIG, { optional: true });
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly fallbackId = `lux-quill-${LuxQuillComponent.nextId++}`;

  /** Id des Editors (contenteditable). Ohne Angabe wird eine eindeutige Id erzeugt. */
  readonly luxId = input<string>('');
  readonly luxLabel = input<string>('');
  readonly luxHint = input<string>('');
  readonly luxPlaceholder = input<string>('');
  /** Zugänglicher Name ohne sichtbares Label. */
  readonly luxAriaLabel = input<string | undefined>(undefined);
  /** Verweis auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel. */
  readonly luxAriaLabelledby = input<string | undefined>(undefined);
  readonly luxErrorMessage = input<string | undefined>(undefined);
  readonly luxErrorCallback = input<LuxErrorCallbackFnType | undefined>(undefined);
  /** Pflichtfeld (nur ohne Formular, in Formularen den Required-Validator verwenden). */
  readonly luxRequired = input(false);
  /**
   * Deaktiviert Editor und Toolbar, auch als [(luxDisabled)]. In Reactive Forms bzw. mit ngModel wird der
   * Zustand wie bei den übrigen LUX-Formularfeldern mit dem FormControl synchronisiert (in beide Richtungen).
   */
  readonly luxDisabled = model(false);
  /** Schreibschutz: Die Toolbar wird ausgeblendet, der Inhalt bleibt per Tastatur erreichbar. */
  readonly readonly = input(false);
  /** Blendet das Label nur visuell aus (es bleibt für Screenreader erhalten). */
  readonly luxNoTopLabel = input(false);
  /** Entfernt den Bereich für Hinweis und Fehlermeldung. */
  readonly luxNoBottomLabel = input(false);
  readonly luxDense = input(false);
  /** Minimale Höhe des Eingabebereichs, z.B. "8rem". */
  readonly luxMinHeight = input<string | undefined>(undefined);
  /** Maximale Höhe des Eingabebereichs, darüber wird gescrollt, z.B. "20rem". */
  readonly luxMaxHeight = input<string | undefined>(undefined);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxPreset = input<LuxQuillPreset>('comment');
  /** Überschreibt einzelne Einstellungen des Presets bzw. von LUX_QUILL_CONFIG. */
  readonly luxConfig = input<Partial<LuxQuillConfig> | undefined>(undefined);

  /**
   * Der Wert als HTML-String, z.B. für [(value)] ohne Formular. Emittiert über valueChange bei Änderungen
   * durch den Benutzer und wenn eine geänderte Konfiguration den Wert anpasst, nicht beim Setzen von außen.
   * Name entsprechend dem Signal-Forms-Vertrag (FormValueControl).
   */
  readonly value = model<string>('');

  readonly luxFocusIn = output<FocusEvent>();
  readonly luxFocusOut = output<FocusEvent>();
  /** Liefert die Quill-Instanz nach jeder (Neu-)Erzeugung, z.B. für Erweiterungen. */
  readonly luxEditorCreated = output<Quill>();

  private readonly editorHost = viewChild.required<ElementRef<HTMLElement>>('editor');
  private readonly wrapperRef = viewChild.required<ElementRef<HTMLElement>>('wrapper');

  readonly uid = computed(() => this.luxId() || this.fallbackId);
  readonly config = computed(() => luxQuillResolveConfig(this.luxPreset(), this.globalConfig, this.luxConfig()));

  /** Die aktuelle Quill-Instanz (null bis zum ersten Rendern). */
  readonly editor = signal<Quill | null>(null);

  protected readonly focused = signal(false);
  // Inhaltlicher Vergleich: Quill meldet bei jedem Tastendruck und jeder Cursorbewegung editor-change.
  // Ohne equal würde jedes neue Objekt die Toolbar neu prüfen, auch wenn sich die Formate nicht ändern.
  protected readonly activeFormats = signal<Record<string, unknown>>({}, { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) });
  private readonly cvaDisabled = signal(false);
  // Zustand des (internen oder Formular-)Controls. Bewusst nicht "touched"/"errors" genannt: Diese
  // Namen sind im Signal-Forms-Vertrag für Inputs reserviert.
  private readonly controlTouched = signal(false);
  private readonly controlErrors = signal<ValidationErrors | null>(null);
  private readonly controlRequired = signal(false);

  readonly isDisabled = computed(() => this.luxDisabled() || this.cvaDisabled());
  readonly isReadonly = computed(() => this.readonly());
  readonly isRequired = computed(() => (this.ngControl ? this.controlRequired() : this.luxRequired()));
  protected readonly indentEnabled = computed(() => this.config().toolbar.some((item) => item === 'indent' || item === 'outdent'));
  protected readonly linkEnabled = computed(() => this.config().toolbar.includes('link'));
  protected readonly showError = computed(() => this.controlTouched() && !!this.controlErrors() && !this.isDisabled());
  protected readonly errorText = computed(() => (this.showError() ? this.fetchErrorMessage(this.controlErrors()!) : ''));
  protected readonly hintId = computed(() => (!this.luxNoBottomLabel() && !this.showError() && this.luxHint() ? this.uid() + '-hint' : null));
  protected readonly errorId = computed(() => (!this.luxNoBottomLabel() && this.showError() ? this.uid() + '-error' : null));
  protected readonly keyboardHintId = computed(() => (this.indentEnabled() && !this.isReadonly() ? this.uid() + '-keyboard-hint' : null));
  protected readonly labelledBy = computed(() => {
    if (this.luxAriaLabelledby()) {
      return this.luxAriaLabelledby()!;
    }
    if (this.luxAriaLabel()) {
      return null;
    }
    return this.luxLabel() ? this.uid() + '-label' : null;
  });

  /** Ohne Formular hält ein internes FormControl Wert und Validierung. */
  private readonly internalControl = new FormControl<string>('', { nonNullable: true });
  private control?: AbstractControl;

  /** Der aktuelle Wert (HTML). */
  private html = '';
  private editorElement?: HTMLElement;
  private editorConfigKey?: string;
  private recreating = false;
  private linkDialogOpen = false;
  private menuClosedTimeout?: ReturnType<typeof setTimeout>;
  private readonly keyboardState: LuxQuillKeyboardState = { tabReleased: false };
  private readonly modulesRefs = new WeakMap<object, number>();
  private modulesCounter = 0;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    afterNextRender({ write: () => this.createEditor() });
    this.destroyRef.onDestroy(() => clearTimeout(this.menuClosedTimeout));

    // Konfigurationsänderungen nach der Initialisierung: Editor neu aufbauen, der Wert bleibt erhalten.
    effect(() => {
      const config = this.config();
      untracked(() => {
        if (this.editor() && this.configKey(config) !== this.editorConfigKey) {
          this.createEditor();
        }
      });
    });

    // [(value)] ohne Formular.
    effect(() => {
      const value = this.value() ?? '';
      untracked(() => {
        if (!this.ngControl && value !== this.html) {
          this.html = value;
          this.internalControl.setValue(value);
          this.writeToEditor();
        }
      });
    });

    // luxRequired ohne Formular.
    effect(() => {
      const required = this.luxRequired();
      untracked(() => {
        if (this.ngControl) {
          if (required) {
            this.logger.error('lux-quill: In Formularen bitte den Required-Validator statt luxRequired verwenden. luxRequired wird ignoriert.');
          }
          return;
        }
        this.internalControl.setValidators(required ? Validators.required : null);
        this.internalControl.updateValueAndValidity();
      });
    });

    // luxDisabled -> FormControl (Reactive Forms/ngModel).
    effect(() => {
      const disabled = this.luxDisabled();
      untracked(() => this.applyDisabledToControl(disabled));
    });

    effect(() => {
      const quill = this.editor();
      const editable = !this.isDisabled() && !this.isReadonly();
      if (quill) {
        quill.enable(editable);
      }
    });

    effect(() => this.updateEditorAttributes());
  }

  ngAfterContentInit() {
    // Erst hier ist das Control von formControlName sicher gesetzt (dessen ngOnChanges läuft nach
    // den Init-Hooks dieser Komponente).
    this.control = this.ngControl?.control ?? this.internalControl;
    this.control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.syncControlState());
    this.syncControlState();
    // Ein deaktiviertes FormControl hat luxDisabled bereits über setDisabledState() gesetzt. Hier bleibt
    // nur der Fall, dass luxDisabled von außen auf true steht.
    this.applyDisabledToControl(this.luxDisabled());

    setTimeout(() => this.checkA11yName());
  }

  ngDoCheck() {
    // Validatoren können sich ändern, ohne dass das Control ein Event auslöst (z.B. setValidators()).
    this.syncControlState();
  }

  // ControlValueAccessor

  writeValue(value: string | null | undefined): void {
    this.html = value ?? '';
    this.writeToEditor();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);

    // Beim Einrichten des Controls ruft Angular immer setDisabledState(control.disabled) auf, also auch
    // mit false. Das darf ein von außen gesetztes luxDisabled=true nicht überschreiben; ngAfterContentInit
    // überträgt es danach auf das Control. Vor der Initialisierung deshalb nur "deaktiviert" übernehmen.
    if (!this.control && !isDisabled) {
      return;
    }

    // FormControl -> luxDisabled: disable()/enable() am Control wird über luxDisabledChange gemeldet.
    if (this.luxDisabled() !== isDisabled) {
      this.luxDisabled.set(isDisabled);
    }
  }

  /** Setzt den Fokus in den Editor. */
  focus() {
    this.editor()?.focus();
  }

  protected onFocusIn(event: FocusEvent) {
    if (!this.focused()) {
      this.focused.set(true);
      this.luxFocusIn.emit(event);
    }
  }

  protected onFocusOut(event: FocusEvent) {
    // Neuaufbau des Editors bzw. offener Link-Dialog: Das ist kein Verlassen der Komponente. Der Dialog
    // gibt den Fokus beim Schließen an den Editor zurück.
    if (this.recreating || this.linkDialogOpen) {
      return;
    }

    const next = event.relatedTarget as HTMLElement | null;
    // Fokus bleibt in der Komponente oder wandert ins Menü der Überschriften-Auswahl (Overlay). Verlässt er
    // das Menü später direkt nach außen, erkennt das onHeadingMenuClosed().
    if (next && ((event.currentTarget as HTMLElement).contains(next) || next.closest('.lux-quill-heading-menu'))) {
      return;
    }

    this.leave(event);
  }

  /**
   * Das Menü der Überschriften-Auswahl wurde geschlossen. Lag der Fokus darin und ist er danach nicht in
   * die Komponente zurückgekehrt (z.B. Klick auf ein anderes Element), gilt die Komponente als verlassen.
   * Geprüft wird verzögert, weil das CDK-Menü den Fokus erst nach dem Schließen zurückgibt.
   */
  protected onHeadingMenuClosed() {
    clearTimeout(this.menuClosedTimeout);
    this.menuClosedTimeout = setTimeout(() => {
      const active = document.activeElement;
      const wrapper = this.wrapperRef().nativeElement;
      if (this.focused() && !this.linkDialogOpen && !(active && wrapper.contains(active))) {
        this.leave(new FocusEvent('focusout', { relatedTarget: active }));
      }
    });
  }

  private leave(event: FocusEvent) {
    this.keyboardState.tabReleased = false;
    this.focused.set(false);
    this.markAsTouched();
    this.luxFocusOut.emit(event);
  }

  protected onToolbarAction(action: LuxQuillToolbarAction) {
    const quill = this.editor();
    if (!quill || this.isDisabled() || this.isReadonly()) {
      return;
    }

    // getSelection(true) fokussiert den Editor und stellt die zuletzt bekannte Selektion wieder her.
    const range = quill.getSelection(true);
    const formats = quill.getFormat(range);

    switch (action.item) {
      case 'bold':
      case 'italic':
      case 'underline':
        quill.format(action.item, !formats[action.item], 'user');
        break;
      case 'bulletList':
        quill.format('list', formats['list'] === 'bullet' ? false : 'bullet', 'user');
        break;
      case 'orderedList':
        quill.format('list', formats['list'] === 'ordered' ? false : 'ordered', 'user');
        break;
      case 'indent':
        quill.format('indent', '+1', 'user');
        break;
      case 'outdent':
        quill.format('indent', '-1', 'user');
        break;
      case 'heading':
        quill.formatLine(range.index, range.length, luxQuillHeadingAttributes(this.config(), action.heading ?? null), 'user');
        break;
      case 'clean':
        this.removeFormat(quill, range);
        break;
      case 'link':
        this.openLinkDialog();
        break;
    }

    this.updateActiveFormats();
  }

  /** Öffnet den Dialog zum Einfügen, Bearbeiten oder Entfernen eines Links. */
  openLinkDialog() {
    const quill = this.editor();
    if (!quill || this.isDisabled() || this.isReadonly() || !this.linkEnabled()) {
      return;
    }

    const range = quill.getSelection(true);
    const url = quill.getFormat(range)['link'];
    let linkRange = range;
    if (url && range.length === 0) {
      const [link, offset] = quill.scroll.descendant(Link, range.index);
      if (link) {
        linkRange = new Range(range.index - offset, link.length());
      }
    }

    const data: LuxQuillLinkDialogData = {
      url: typeof url === 'string' ? url : '',
      hasLink: !!url,
      askForText: !url && range.length === 0
    };

    // Solange der Dialog offen ist, gilt der Fokuswechsel nicht als Verlassen der Komponente (siehe onFocusOut).
    this.linkDialogOpen = true;
    this.dialogService
      .openComponent(LuxQuillLinkDialogComponent, { width: 'auto', minWidth: 'min(30rem, 90vw)', disableClose: false }, data)
      .dialogClosed.pipe(take(1))
      .subscribe((result: LuxQuillLinkDialogResult) => {
        this.linkDialogOpen = false;
        this.applyLinkResult(quill, linkRange, result);
      });
  }

  private applyLinkResult(quill: Quill, range: Range, result: LuxQuillLinkDialogResult) {
    if (this.editor() !== quill) {
      return;
    }

    if (result?.action === 'apply') {
      if (result.text) {
        quill.insertText(range.index, result.text, 'link', result.url, 'user');
        quill.setSelection(range.index + result.text.length, 0, 'user');
      } else {
        quill.formatText(range.index, range.length, 'link', result.url, 'user');
        quill.setSelection(range.index + range.length, 0, 'user');
      }
    } else if (result?.action === 'remove') {
      quill.formatText(range.index, range.length, 'link', false, 'user');
      quill.setSelection(range.index + range.length, 0, 'user');
    } else {
      quill.setSelection(range, 'user');
    }

    this.updateActiveFormats();
  }

  private removeFormat(quill: Quill, range: Range) {
    if (range.length > 0) {
      quill.removeFormat(range.index, range.length, 'user');
      return;
    }

    // Ohne Markierung die Formate der aktuellen Zeile entfernen.
    const [line, offset] = quill.getLine(range.index);
    if (line) {
      quill.removeFormat(range.index - offset, line.length(), 'user');
    }
  }

  private createEditor() {
    const host = this.editorHost().nativeElement;
    luxQuillRegisterFormats();

    let hadFocus = false;
    const recreated = !!this.editorElement;
    if (this.editorElement) {
      // Beim Neuaufbau löst das Entfernen des fokussierten Editors ein focusout aus - mitten in der
      // Change Detection. Das ist kein Verlassen der Komponente und wird deshalb ignoriert.
      hadFocus = this.editorElement.contains(document.activeElement);
      this.recreating = true;
      this.renderer.removeChild(host, this.editorElement);
      this.recreating = false;
    }

    const config = this.config();
    const element: HTMLElement = this.renderer.createElement('div');
    this.renderer.appendChild(host, element);
    this.editorElement = element;
    this.editorConfigKey = this.configKey(config);

    const quill = this.ngZone.runOutsideAngular(() => {
      const instance = new Quill(element, {
        formats: luxQuillFormats(config),
        placeholder: this.luxPlaceholder(),
        readOnly: this.isDisabled() || this.isReadonly(),
        modules: this.createModules(config)
      });

      instance.root.classList.add('lux-quill-content');
      instance.root.addEventListener('keydown', (event: KeyboardEvent) => {
        if (!LUX_QUILL_RELEASE_KEYS.includes(event.key)) {
          this.keyboardState.tabReleased = false;
        }
      });
      instance.on('editor-change', () => this.updateActiveFormats());
      instance.on('text-change', () => this.onEditorTextChange());
      return instance;
    });

    this.editor.set(quill);
    this.writeToEditor();
    if (recreated) {
      this.syncAdaptedValue(quill);
    }
    // Direkt setzen: Der Effekt dafür läuft erst im nächsten Change-Detection-Durchlauf.
    this.updateEditorAttributes();
    if (hadFocus) {
      quill.focus();
    }
    this.luxEditorCreated.emit(quill);
  }

  private createModules(config: LuxQuillConfig): Record<string, unknown> {
    const custom = config.modules as Record<string, Record<string, unknown> | undefined>;
    const keyboard = custom['keyboard'] ?? {};
    const clipboard = custom['clipboard'] ?? {};

    return {
      ...custom,
      keyboard: {
        ...keyboard,
        bindings: {
          ...luxQuillKeyboardBindings(this.keyboardState, {
            isIndentEnabled: () => this.indentEnabled(),
            isLinkEnabled: () => this.linkEnabled(),
            openLinkDialog: () => this.ngZone.run(() => this.openLinkDialog())
          }),
          ...((keyboard['bindings'] as Record<string, unknown>) ?? {})
        }
      },
      clipboard: {
        ...clipboard,
        matchers: [luxQuillHeadingMatcher(config), ...((clipboard['matchers'] as unknown[]) ?? [])]
      },
      // Keine Uploads (z.B. per Drag & Drop eingefügte Bilder).
      uploader: { mimetypes: [], ...(custom['uploader'] ?? {}) }
    };
  }

  /** Schlüssel einer Konfiguration: Ändert er sich, wird der Editor neu aufgebaut. */
  private configKey(config: LuxQuillConfig): string {
    return JSON.stringify([config.headingMode, config.headingLevels, config.toolbar, config.formats]) + '|' + this.modulesId(config.modules);
  }

  /** Module können Funktionen enthalten und werden deshalb über ihre Referenz verglichen. */
  private modulesId(modules: object): number {
    let id = this.modulesRefs.get(modules);
    if (id === undefined) {
      id = this.modulesCounter++;
      this.modulesRefs.set(modules, id);
    }
    return id;
  }

  /** Überträgt den aktuellen Wert in den Editor (ohne Change-Events). */
  private writeToEditor() {
    const quill = this.editor();
    if (!quill) {
      return;
    }

    if (this.readEditorHtml(quill) === this.html) {
      return;
    }

    const delta = quill.clipboard.convert({ html: this.html });
    quill.setContents(delta, 'silent');
    this.updateActiveFormats();
  }

  private onEditorTextChange() {
    const quill = this.editor();
    if (!quill) {
      return;
    }

    const html = this.readEditorHtml(quill);
    if (html === this.html) {
      return;
    }

    this.html = html;
    this.ngZone.run(() => {
      if (this.ngControl) {
        this.onChange(html);
      } else {
        this.internalControl.setValue(html);
      }
      this.value.set(html);
    });
  }

  /**
   * Nach einem Neuaufbau durch eine geänderte Konfiguration: Der Wert wurde beim Laden an die neue
   * Konfiguration angepasst (z.B. <h1> -> <p class="lux-quill-heading-1"> bei headingMode 'visual',
   * nicht mehr erlaubte Formate entfernt). Diesen Wert zurückmelden, damit Editor und Wert übereinstimmen.
   * Im Formular ohne "dirty": Die Änderung stammt nicht vom Benutzer.
   */
  private syncAdaptedValue(quill: Quill) {
    const html = this.readEditorHtml(quill);
    if (html === this.html) {
      return;
    }

    this.html = html;
    this.ngZone.run(() => {
      if (this.ngControl) {
        this.control?.setValue(html, { emitModelToViewChange: false });
        // Bei ngModel aktualisiert setValue() das gebundene Model nicht, erst viewToModelUpdate() meldet
        // den Wert über ngModelChange - ebenfalls ohne das Control als dirty zu markieren.
        this.ngControl.viewToModelUpdate(html);
      } else {
        this.internalControl.setValue(html);
      }
      this.value.set(html);
    });
  }

  private readEditorHtml(quill: Quill): string {
    if (quill.getText().trim().length === 0) {
      return '';
    }
    return luxQuillNormalizeHtml(quill.getSemanticHTML());
  }

  private updateActiveFormats() {
    const quill = this.editor();
    const range = quill?.getSelection();
    this.activeFormats.set(quill && range ? quill.getFormat(range) : {});
  }

  private markAsTouched() {
    if (this.ngControl) {
      this.ngZone.run(() => this.onTouched());
    } else {
      this.internalControl.markAsTouched();
    }
  }

  /** Überträgt luxDisabled auf das Formular-Control (nur in Reactive Forms bzw. mit ngModel). */
  private applyDisabledToControl(disabled: boolean) {
    const control = this.ngControl ? this.control : undefined;
    if (!control || control.disabled === disabled) {
      return;
    }

    if (disabled) {
      control.disable();
    } else {
      control.enable();
    }
  }

  private syncControlState() {
    const control = this.control;
    if (!control) {
      return;
    }

    this.controlTouched.set(control.touched);
    this.controlErrors.set(control.errors);
    this.controlRequired.set(control.hasValidator(Validators.required));
  }

  private fetchErrorMessage(errors: ValidationErrors): string {
    const value = this.control?.value;
    return (
      this.luxErrorMessage() ||
      this.luxErrorCallback()?.(value, errors) ||
      LuxUtil.getErrorMessage(this.tService, this.control as FormControl) ||
      this.tService.translate('luxc.quill.error_message.invalid')
    );
  }

  private updateEditorAttributes() {
    const quill = this.editor();
    if (!quill) {
      return;
    }

    const root = quill.root;
    const describedBy = [this.errorId() ?? this.hintId(), this.keyboardHintId()].filter((id) => !!id).join(' ');
    const readonly = this.isReadonly() && !this.isDisabled();

    this.setAttribute(root, 'id', this.uid());
    this.setAttribute(root, 'role', 'textbox');
    this.setAttribute(root, 'aria-multiline', 'true');
    this.setAttribute(root, 'aria-labelledby', this.labelledBy());
    this.setAttribute(root, 'aria-label', this.labelledBy() ? null : (this.luxAriaLabel() ?? null));
    this.setAttribute(root, 'aria-describedby', describedBy || null);
    this.setAttribute(root, 'aria-required', this.isRequired() ? 'true' : null);
    this.setAttribute(root, 'aria-invalid', this.showError() ? 'true' : null);
    this.setAttribute(root, 'aria-readonly', readonly ? 'true' : null);
    this.setAttribute(root, 'aria-disabled', this.isDisabled() ? 'true' : null);
    // Schreibgeschützte Inhalte sollen per Tastatur erreichbar und lesbar bleiben.
    this.setAttribute(root, 'tabindex', readonly ? '0' : null);
    this.setAttribute(root, 'data-placeholder', this.luxPlaceholder() || null);
  }

  private setAttribute(element: HTMLElement, name: string, value: string | null) {
    if (value === null) {
      this.renderer.removeAttribute(element, name);
    } else {
      this.renderer.setAttribute(element, name, value);
    }
  }

  private checkA11yName() {
    if (!this.luxLabel() && !this.luxAriaLabel() && !this.luxAriaLabelledby()) {
      this.logger.warn('A11y: lux-quill besitzt keinen zugänglichen Namen. Bitte luxLabel (ggf. mit luxNoTopLabel), luxAriaLabel oder luxAriaLabelledby setzen.');
    }
  }
}
