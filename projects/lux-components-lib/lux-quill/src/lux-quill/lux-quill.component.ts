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
 * über [(luxValue)] sowie in Reactive Forms bzw. mit ngModel (ControlValueAccessor).
 */
@Component({
  selector: 'lux-quill',
  templateUrl: './lux-quill.component.html',
  styleUrl: './lux-quill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxQuillToolbarComponent, LuxIconComponent, LuxTagIdDirective, MatError, MatHint, TranslocoPipe],
  host: {
    class: 'lux-quill lux-form-control-wrapper-host',
    '[class.lux-form-control-readonly]': 'luxReadonly()'
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
  readonly luxDisabled = input(false);
  readonly luxReadonly = input(false);
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

  /** Der Wert als HTML-String (für die Nutzung ohne Formular). */
  readonly luxValue = model<string>('');

  readonly luxFocusIn = output<FocusEvent>();
  readonly luxFocusOut = output<FocusEvent>();
  /** Liefert die Quill-Instanz nach jeder (Neu-)Erzeugung, z.B. für Erweiterungen. */
  readonly luxEditorCreated = output<Quill>();

  private readonly editorHost = viewChild.required<ElementRef<HTMLElement>>('editor');

  readonly uid = computed(() => this.luxId() || this.fallbackId);
  readonly config = computed(() => luxQuillResolveConfig(this.luxPreset(), this.globalConfig, this.luxConfig()));

  /** Die aktuelle Quill-Instanz (null bis zum ersten Rendern). */
  readonly editor = signal<Quill | null>(null);

  protected readonly focused = signal(false);
  protected readonly activeFormats = signal<Record<string, unknown>>({});
  private readonly cvaDisabled = signal(false);
  private readonly touched = signal(false);
  private readonly errors = signal<ValidationErrors | null>(null);
  private readonly controlRequired = signal(false);

  readonly disabled = computed(() => this.luxDisabled() || this.cvaDisabled());
  readonly required = computed(() => (this.ngControl ? this.controlRequired() : this.luxRequired()));
  protected readonly indentEnabled = computed(() => this.config().toolbar.some((item) => item === 'indent' || item === 'outdent'));
  protected readonly linkEnabled = computed(() => this.config().toolbar.includes('link'));
  protected readonly showError = computed(() => this.touched() && !!this.errors() && !this.disabled());
  protected readonly errorText = computed(() => (this.showError() ? this.fetchErrorMessage(this.errors()!) : ''));
  protected readonly hintId = computed(() => (!this.luxNoBottomLabel() && !this.showError() && this.luxHint() ? this.uid() + '-hint' : null));
  protected readonly errorId = computed(() => (!this.luxNoBottomLabel() && this.showError() ? this.uid() + '-error' : null));
  protected readonly keyboardHintId = computed(() => (this.indentEnabled() && !this.luxReadonly() ? this.uid() + '-keyboard-hint' : null));
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

    // Konfigurationsänderungen nach der Initialisierung: Editor neu aufbauen, der Wert bleibt erhalten.
    effect(() => {
      const config = this.config();
      untracked(() => {
        if (this.editor() && this.configKey(config) !== this.editorConfigKey) {
          this.createEditor();
        }
      });
    });

    // [(luxValue)] ohne Formular.
    effect(() => {
      const value = this.luxValue() ?? '';
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

    effect(() => {
      const quill = this.editor();
      const editable = !this.disabled() && !this.luxReadonly();
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
    if (this.recreating) {
      return;
    }

    const next = event.relatedTarget as HTMLElement | null;
    // Fokus bleibt in der Komponente oder wandert ins Menü der Überschriften-Auswahl (Overlay).
    if (next && ((event.currentTarget as HTMLElement).contains(next) || next.closest('.lux-quill-heading-menu'))) {
      return;
    }

    this.keyboardState.tabReleased = false;
    this.focused.set(false);
    this.markAsTouched();
    this.luxFocusOut.emit(event);
  }

  protected onToolbarAction(action: LuxQuillToolbarAction) {
    const quill = this.editor();
    if (!quill || this.disabled() || this.luxReadonly()) {
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
    if (!quill || this.disabled() || this.luxReadonly() || !this.linkEnabled()) {
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

    this.dialogService
      .openComponent(LuxQuillLinkDialogComponent, { width: 'auto', minWidth: 'min(30rem, 90vw)', disableClose: false }, data)
      .dialogClosed.pipe(take(1))
      .subscribe((result: LuxQuillLinkDialogResult) => this.applyLinkResult(quill, linkRange, result));
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
        readOnly: this.disabled() || this.luxReadonly(),
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
      this.luxValue.set(html);
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

  private syncControlState() {
    const control = this.control;
    if (!control) {
      return;
    }

    this.touched.set(control.touched);
    this.errors.set(control.errors);
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
    const readonly = this.luxReadonly() && !this.disabled();

    this.setAttribute(root, 'id', this.uid());
    this.setAttribute(root, 'role', 'textbox');
    this.setAttribute(root, 'aria-multiline', 'true');
    this.setAttribute(root, 'aria-labelledby', this.labelledBy());
    this.setAttribute(root, 'aria-label', this.labelledBy() ? null : (this.luxAriaLabel() ?? null));
    this.setAttribute(root, 'aria-describedby', describedBy || null);
    this.setAttribute(root, 'aria-required', this.required() ? 'true' : null);
    this.setAttribute(root, 'aria-invalid', this.showError() ? 'true' : null);
    this.setAttribute(root, 'aria-readonly', readonly ? 'true' : null);
    this.setAttribute(root, 'aria-disabled', this.disabled() ? 'true' : null);
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
