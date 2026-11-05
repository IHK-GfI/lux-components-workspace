import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  LuxAriaLabelDirective,
  LuxAutofocusDirective,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCardInfoComponent,
  LuxChipComponent,
  LuxChipsComponent,
  LuxIconColor,
  LuxIconComponent,
  LuxIconRegistryService,
  LuxInfiniteScrollDirective,
  LuxInputComponent,
  LuxInputPrefixComponent,
  LuxMediaQueryObserverService,
  LuxRadioComponent,
  LuxSelectComponent,
  LuxSvgIcon,
  LuxTooltipDirective
} from '@ihk-gfi/lux-components';

declare interface SearchBinding {
  label: string;
  value: 'and' | 'or';
}

@Component({
  selector: 'icon-overview',
  templateUrl: './icon-overview.component.html',
  styleUrls: ['./icon-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxCardContentComponent,
    LuxCardInfoComponent,
    LuxCardComponent,
    LuxAriaLabelDirective,
    LuxTooltipDirective,
    LuxInfiniteScrollDirective,
    LuxSelectComponent,
    LuxRadioComponent,
    LuxInputPrefixComponent,
    LuxInputComponent,
    LuxChipsComponent,
    LuxChipComponent,
    LuxAutofocusDirective,
    NgTemplateOutlet,
    NgClass
  ]
})
export class IconOverviewComponent implements OnInit, OnDestroy {
  readonly scrollContainer = viewChild<ElementRef>('scrollContainer');

  allIcons: LuxSvgIcon[];
  blockSize = 100;
  readonly codeSnippet = signal('');
  readonly copiedToClipboard = signal(false);
  readonly displayedIcons = signal<LuxSvgIcon[]>([]);
  fgBgOptions = [
    { label: 'Linienfarbe', value: false },
    { label: 'Hintergrundfarbe', value: true }
  ];
  readonly filteredIcons = signal<LuxSvgIcon[]>([]);
  iconColorOptions = [
    { label: 'Blau (primary)', value: 'blue' },
    { label: 'Grün (accent)', value: 'green' },
    { label: 'Rot (warn)', value: 'red' },
    { label: 'Hellblau', value: 'lightblue' },
    { label: 'Gelb', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Rosa', value: 'pink' },
    { label: 'Violett', value: 'purple' },
    { label: 'Grau', value: 'gray' },
    { label: 'Braun', value: 'brown' },
    { label: 'Schwarz', value: 'black' }
  ];
  iconSizesOptions: string[] = ['1x', '2x', '3x', '4x', '5x'];
  readonly mobileView = signal(false);
  searchBindingOptions: SearchBinding[] = [
    { label: 'Und', value: 'and' },
    { label: 'Oder', value: 'or' }
  ];
  readonly selectedSearchBinding = signal(this.searchBindingOptions[0]);
  subscriptions: Subscription[] = [];

  get inputValue() {
    return this._inputValue();
  }

  set inputValue(input: string) {
    const newValue = input ?? '';
    if (this._inputValue() !== newValue) {
      this._inputValue.set(newValue);
      this.onIconSearch(newValue);
    }
  }

  get chipLabels() {
    return this._chipLabels();
  }

  set chipLabels(labels: string[]) {
    this._chipLabels.set(labels);
  }

  get previewItem() {
    return this._previewItem();
  }

  set previewItem(item: LuxSvgIcon | undefined) {
    this._previewItem.set(item);
    this.updateCodeSnippet();
  }

  get iconSize() {
    return this._iconSize();
  }

  set iconSize(size: string) {
    this._iconSize.set(size);
    this.updateCodeSnippet();
  }

  get iconColor() {
    return this._iconColor();
  }

  set iconColor(color: LuxIconColor) {
    this._iconColor.set(color);
    this.updateCodeSnippet();
  }

  get iconClass() {
    return this._iconClass();
  }

  set iconClass(iClass: string) {
    this._iconClass.set(iClass);
    this.updateCodeSnippet();
  }

  get isBgColor() {
    return this._isBgColor();
  }

  set isBgColor(value: boolean) {
    this._isBgColor.set(value);
    this.updateCodeSnippet();
  }

  private mediaQuery = inject(LuxMediaQueryObserverService);
  private iconReg = inject(LuxIconRegistryService);
  private clipboard = inject(Clipboard);

  private readonly _chipLabels = signal<string[]>([]);
  private readonly _iconClass = signal('lux-color-blue');
  private readonly _iconColor = signal<LuxIconColor>('blue');
  private readonly _iconSize = signal('2x');
  private readonly _inputValue = signal('');
  private readonly _isBgColor = signal(false);
  private readonly _previewItem = signal<LuxSvgIcon | undefined>(undefined);

  constructor() {
    this.mobileView.set(this.mediaQuery.isSmaller('md'));
    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
        this.mobileView.set(this.mediaQuery.isSmaller('md'));
      })
    );

    this.allIcons = this.iconReg.getSvgIconList();
  }

  ngOnInit(): void {
    this.updateIcons(this.allIcons, false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onScroll() {
    const filteredIcons = this.filteredIcons();
    if (filteredIcons.length > 0) {
      const start = 0;
      const end = Math.min(this.blockSize, filteredIcons.length);
      const nextBatch = filteredIcons.slice(start, end);
      this.filteredIcons.set(filteredIcons.slice(end));
      this.displayedIcons.update((icons) => [...icons, ...nextBatch]);
    }
  }

  onIconSearch(searchText: string) {
    if (searchText) {
      const filterValue = searchText.toLowerCase();
      const values = filterValue.split(' ');
      this.chipLabels = values;

      let resultIcons: LuxSvgIcon[] = [];

      if (this.selectedSearchBinding().value === 'and') {
        for (const value of values) {
          const valueResult = this.allIcons.filter((icon) => icon.iconName.toLowerCase().includes(value));

          if (resultIcons.length > 0) {
            const intersection = resultIcons.filter((icon) => valueResult.includes(icon));

            if (intersection) {
              resultIcons = intersection;
            } else {
              resultIcons = [];
              break;
            }
          } else {
            resultIcons.push(...valueResult);
          }
        }
      } else {
        values.forEach((value) => {
          const valueResult = this.allIcons.filter((icon) => icon.iconName.toLowerCase().includes(value));
          if (valueResult) {
            const newIcons = valueResult.filter((icon) => !resultIcons.includes(icon));
            if (newIcons) {
              resultIcons.push(...newIcons);
            }
          }
        });
      }

      this.updateIcons(resultIcons);

      const scrollContainer = this.scrollContainer();
      if (scrollContainer) {
        scrollContainer.nativeElement.scrollTop = 0;
      }
    } else {
      this.updateIcons(this.allIcons);
      this.chipLabels = [];
    }
  }

  onChipRemoved(event: number) {
    const temp = this.inputValue.split(' ');
    temp.splice(event, 1);
    this.inputValue = temp.join(' ');
  }

  onIconClicked(item: LuxSvgIcon) {
    this.previewItem = item;
  }

  onCopyToClipboard() {
    this.clipboard.copy(this.codeSnippet());
    this.copiedToClipboard.set(true);
  }

  onColorChanged(color: { label: string; value: LuxIconColor }) {
    this.iconColor = color.value;
    this.iconClass = `lux-color-${color.value}`;
  }

  onBgChanged(option: { label: string; value: boolean }) {
    this.isBgColor = option.value;
  }

  onSearchBindingChanged() {
    this.onIconSearch(this.inputValue);
  }

  private updateCodeSnippet() {
    if (this.previewItem) {
      if (!this.isBgColor) {
        this.codeSnippet.set(`
<lux-icon
  luxIconName="${this.previewItem.iconName.split('--')[0].toLowerCase()}"
  luxIconSize="${this.iconSize}"
  class="lux-color-${this.iconColor}">
</lux-icon>`);
      } else {
        this.codeSnippet.set(`
<lux-icon
  luxIconName="${this.previewItem.iconName.split('--')[0].toLowerCase()}"
  luxIconSize="${this.iconSize}"
  luxColor="${this.iconColor}">
</lux-icon>`);
      }
    }
    this.copiedToClipboard.set(false);
  }

  private updateIcons(icons: LuxSvgIcon[], resetDisplayedIcons = true) {
    this.filteredIcons.set([...icons]);
    if (resetDisplayedIcons) {
      this.displayedIcons.set([]);
    }
    this.onScroll();

    if (this.displayedIcons().length > 0) {
      this.previewItem = this.displayedIcons()[0];
    } else {
      this.previewItem = undefined;
    }
  }
}
