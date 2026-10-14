import { CdkMenu, CdkMenuItemRadio, CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';
import { LuxIconComponent, LuxTooltipDirective } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxQuillHeadingMode, LuxQuillToolbarItem } from '../lux-quill-config';
import { LUX_QUILL_HEADING_FORMAT, LuxQuillHeadingStyle } from '../lux-quill-formats';

/** Aktion, die ein Toolbar-Eintrag auslöst. */
export interface LuxQuillToolbarAction {
  item: LuxQuillToolbarItem;
  /** Nur bei item 'heading': gewünschte Überschriften-Stufe bzw. null für Standardtext. */
  heading?: LuxQuillHeadingStyle | null;
}

interface ToolbarButton {
  item: Exclude<LuxQuillToolbarItem, 'heading'>;
  icon: string;
  /** true = Umschalter mit aria-pressed. */
  toggle: boolean;
}

const BUTTONS: Record<Exclude<LuxQuillToolbarItem, 'heading'>, ToolbarButton> = {
  bold: { item: 'bold', icon: 'lux-interface-text-formatting-bold', toggle: true },
  italic: { item: 'italic', icon: 'lux-interface-text-formatting-italic', toggle: true },
  underline: { item: 'underline', icon: 'lux-interface-text-formatting-underline', toggle: true },
  bulletList: { item: 'bulletList', icon: 'lux-interface-text-formatting-list-bullets', toggle: true },
  orderedList: { item: 'orderedList', icon: 'lux-ordered-list', toggle: true },
  outdent: { item: 'outdent', icon: 'lux-interface-text-formatting-indent-decrease', toggle: false },
  indent: { item: 'indent', icon: 'lux-interface-text-formatting-indent-increase', toggle: false },
  link: { item: 'link', icon: 'lux-interface-link', toggle: true },
  clean: { item: 'clean', icon: 'lux-interface-text-formatting-eraser', toggle: false }
};

/**
 * Toolbar des lux-quill-Editors (interne Komponente).
 *
 * Umgesetzt nach dem WAI-ARIA-Toolbar-Pattern: Die Toolbar ist ein einziger Tab-Stopp,
 * innerhalb wird mit Pfeil links/rechts sowie Pos1/Ende navigiert (Roving Tabindex).
 */
@Component({
  selector: 'lux-quill-toolbar',
  templateUrl: './lux-quill-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenu, CdkMenuItemRadio, CdkMenuTrigger, LuxIconComponent, LuxTooltipDirective, TranslocoPipe],
  host: {
    class: 'lux-quill-toolbar',
    role: 'toolbar',
    '[attr.aria-label]': 'luxAriaLabel()',
    '[attr.aria-controls]': 'luxEditorId() || null',
    '[attr.aria-disabled]': 'luxDisabled() || null',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusIn($event)'
  }
})
export class LuxQuillToolbarComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly luxItems = input<LuxQuillToolbarItem[]>([]);
  readonly luxHeadingMode = input<LuxQuillHeadingMode>('none');
  readonly luxActiveFormats = input<Record<string, unknown>>({});
  readonly luxDisabled = input(false);
  readonly luxEditorId = input<string>('');
  readonly luxAriaLabel = input<string>('');

  readonly luxAction = output<LuxQuillToolbarAction>();

  protected readonly headingStyles: (LuxQuillHeadingStyle | null)[] = [null, 1, 2];

  /** Index des Controls, das per Tab erreichbar ist (Roving Tabindex). */
  protected readonly activeIndex = signal(0);

  protected readonly showHeading = computed(() => this.luxHeadingMode() !== 'none' && this.luxItems().includes('heading'));

  protected readonly buttons = computed(() =>
    this.luxItems()
      .filter((item): item is Exclude<LuxQuillToolbarItem, 'heading'> => item !== 'heading')
      .map((item) => BUTTONS[item])
      .filter((button) => !!button)
  );

  protected readonly headingStyle = computed<LuxQuillHeadingStyle | null>(() => {
    const value = this.luxActiveFormats()[LUX_QUILL_HEADING_FORMAT];
    return value === '1' ? 1 : value === '2' ? 2 : null;
  });

  /** Index des ersten Buttons (hinter der Überschriften-Auswahl). */
  protected readonly buttonOffset = computed(() => (this.showHeading() ? 1 : 0));

  /** activeIndex, begrenzt auf die aktuell vorhandenen Controls (die Einträge können sich ändern). */
  protected readonly rovingIndex = computed(() => Math.min(this.activeIndex(), this.buttonOffset() + this.buttons().length - 1));

  isPressed(item: LuxQuillToolbarItem): boolean {
    const formats = this.luxActiveFormats();
    switch (item) {
      case 'bold':
      case 'italic':
      case 'underline':
        return !!formats[item];
      case 'bulletList':
        return formats['list'] === 'bullet';
      case 'orderedList':
        return formats['list'] === 'ordered';
      case 'link':
        return !!formats['link'];
      default:
        return false;
    }
  }

  headingLabelKey(style: LuxQuillHeadingStyle | null): string {
    return style === null ? 'luxc.quill.heading.normal' : `luxc.quill.heading.h${style}`;
  }

  onAction(item: LuxQuillToolbarItem, heading?: LuxQuillHeadingStyle | null) {
    if (this.luxDisabled()) {
      return;
    }
    this.luxAction.emit(heading === undefined ? { item } : { item, heading });
  }

  /** Verhindert, dass der Editor beim Klick auf die Toolbar den Fokus und damit die Selektion verliert. */
  onMousedown(event: MouseEvent) {
    event.preventDefault();
  }

  onFocusIn(event: FocusEvent) {
    const index = this.controls().indexOf(event.target as HTMLElement);
    if (index >= 0) {
      this.activeIndex.set(index);
    }
  }

  onKeydown(event: KeyboardEvent) {
    const controls = this.controls();
    if (controls.length === 0) {
      return;
    }

    let index: number;
    switch (event.key) {
      case 'ArrowRight':
        index = (this.activeIndex() + 1) % controls.length;
        break;
      case 'ArrowLeft':
        index = (this.activeIndex() - 1 + controls.length) % controls.length;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = controls.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.activeIndex.set(index);
    controls[index].focus();
  }

  private controls(): HTMLElement[] {
    return Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.lux-quill-toolbar-control'));
  }
}
